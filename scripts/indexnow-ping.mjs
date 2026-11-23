#!/usr/bin/env node
/**
 * Tell IndexNow (Bing, Yandex, Seznam, Naver, and the AI search tools that
 * read their indexes) about every URL in the live sitemap.
 *
 *   npm run indexnow              # pings every URL in https://midiroad.com/sitemap.xml
 *   npm run indexnow -- --dry-run # lists the URLs without sending them
 *
 * The key is public by design: IndexNow checks it by fetching
 * https://midiroad.com/<key>.txt, which is served from public/.
 * Run this after a deploy that adds or changes pages.
 */

const HOST = "midiroad.com";
const KEY = "6b8030468b8020792428d1dc16fe48b5";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = process.env.SITEMAP_URL ?? `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** IndexNow accepts up to 10,000 URLs per request. */
const BATCH = 10_000;

const dryRun = process.argv.includes("--dry-run");

async function sitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`${SITEMAP} returned ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, "&"),
  );
  // IndexNow rejects the whole batch if any URL is on another host.
  return [...new Set(urls)].filter((url) => new URL(url).hostname === HOST);
}

async function main() {
  const urls = await sitemapUrls();
  console.log(`${urls.length} URLs from ${SITEMAP}`);
  if (urls.length === 0) return;
  if (dryRun) {
    for (const url of urls) console.log(url);
    return;
  }

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    const body = await res.text();
    // 200 = accepted, 202 = accepted while the key is still being verified.
    console.log(`IndexNow ${res.status} ${res.statusText} for ${urlList.length} URLs${body ? `: ${body}` : ""}`);
    if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
