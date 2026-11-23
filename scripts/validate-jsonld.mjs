#!/usr/bin/env node
/**
 * Fetch pages as plain HTML (no JavaScript runs) and check their JSON-LD.
 *
 *   npm run build && npm run start      # in one terminal
 *   npm run validate:jsonld             # in another; defaults to http://localhost:3000
 *   BASE_URL=https://midiroad.com npm run validate:jsonld
 *
 * Checks: every block parses; every node has @context and @type; an @id names
 * one node only; Organization has the YouTube sameAs; BreadcrumbList positions
 * run 1..n with absolute midiroad.com URLs (and pattern trails go
 * Home > MIDI > genre hub > pattern); FAQPage questions have answers; Article
 * has headline, author, publisher and dates. Also confirms each page has a
 * <title>, a self-referencing canonical, and its main heading in the HTML.
 */

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://midiroad.com";

const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/",
      "/midi/trap",
      "/midi/drill/rolling-hi-hat-drill-132-bpm",
      "/guides",
      "/guides/how-to-make-trap-drums",
    ];

const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function nodesOf(block) {
  const list = Array.isArray(block) ? block : [block];
  return list.flatMap((node) => (node && node["@graph"] ? node["@graph"] : [node]));
}

function checkBreadcrumb(page, node) {
  const items = node.itemListElement ?? [];
  if (items.length < 2) fail(page, "BreadcrumbList has fewer than 2 items");
  items.forEach((item, i) => {
    if (item.position !== i + 1) fail(page, `breadcrumb item ${i} has position ${item.position}`);
    if (!item.name) fail(page, `breadcrumb item ${i + 1} has no name`);
    if (typeof item.item !== "string" || !item.item.startsWith(SITE))
      fail(page, `breadcrumb item ${i + 1} URL is not on ${SITE}: ${item.item}`);
  });
  const parts = page.split("/").filter(Boolean);
  if (parts[0] === "midi" && parts.length === 3 && parts[1] !== "bpm") {
    const expected = [SITE, `${SITE}/midi`, `${SITE}/midi/${parts[1]}`, `${SITE}${page}`];
    const got = items.map((i) => i.item);
    if (JSON.stringify(got) !== JSON.stringify(expected))
      fail(page, `pattern breadcrumb is ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  }
  const last = items.at(-1)?.item;
  if (last && last !== (page === "/" ? SITE : `${SITE}${page}`)) fail(page, `last breadcrumb is ${last}, not the page`);
}

async function checkPage(page) {
  const res = await fetch(`${BASE}${page}`, { redirect: "manual" });
  if (res.status !== 200) return fail(page, `HTTP ${res.status}`);
  const html = await res.text();

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(page, "no <title>");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expectedCanonical = page === "/" ? SITE : `${SITE}${page}`;
  if (canonical !== expectedCanonical) fail(page, `canonical is ${canonical}, expected ${expectedCanonical}`);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "");
  if (!h1) fail(page, "no <h1> in server HTML");
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) fail(page, "no JSON-LD");
  const nodes = [];
  for (const raw of blocks) {
    try {
      nodes.push(...nodesOf(JSON.parse(raw)));
    } catch (err) {
      fail(page, `JSON-LD does not parse: ${err.message}`);
    }
  }

  const ids = new Map();
  for (const node of nodes) {
    if (node["@context"] !== "https://schema.org") fail(page, `${node["@type"]} has @context ${node["@context"]}`);
    if (!node["@type"]) fail(page, "node without @type");
    const id = node["@id"];
    if (id) {
      if (ids.has(id) && ids.get(id) !== node["@type"])
        fail(page, `@id ${id} is used by both ${ids.get(id)} and ${node["@type"]}`);
      ids.set(id, node["@type"]);
    }
    switch (node["@type"]) {
      case "Organization":
        if (id !== `${SITE}/#organization`) fail(page, `Organization @id is ${id}`);
        if (JSON.stringify(node.sameAs) !== JSON.stringify(["https://www.youtube.com/@midiroad"]))
          fail(page, `Organization sameAs is ${JSON.stringify(node.sameAs)}`);
        break;
      case "WebSite":
        if (id !== `${SITE}/#website`) fail(page, `WebSite @id is ${id}`);
        if (node.publisher?.["@id"] !== `${SITE}/#organization`) fail(page, "WebSite publisher is not the Organization");
        break;
      case "BreadcrumbList":
        checkBreadcrumb(page, node);
        break;
      case "FAQPage":
        if (!node.mainEntity?.length) fail(page, "FAQPage has no questions");
        for (const q of node.mainEntity ?? []) {
          if (q["@type"] !== "Question" || !q.name || !q.acceptedAnswer?.text) fail(page, `bad FAQ entry ${q.name}`);
        }
        break;
      case "Article":
        for (const key of ["headline", "author", "publisher", "datePublished", "dateModified", "mainEntityOfPage"]) {
          if (!node[key]) fail(page, `Article is missing ${key}`);
        }
        if (node.headline?.length > 110) fail(page, "Article headline is over 110 characters");
        break;
    }
  }
  const publisherRefs = nodes.flatMap((n) => [n.publisher, n.seller, n.offers?.seller]).filter(Boolean);
  for (const ref of publisherRefs) {
    if (ref["@id"] && ref["@id"] !== `${SITE}/#organization`) fail(page, `publisher/seller points to ${ref["@id"]}`);
  }

  const types = nodes.map((n) => n["@type"]).join(", ");
  console.log(`${page}\n  title: ${title}\n  canonical: ${canonical}${robots ? `\n  robots: ${robots}` : ""}\n  h1: ${decode(h1 ?? "").trim()}\n  JSON-LD: ${types}`);
}

for (const page of PAGES) await checkPage(page);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.map((e) => `- ${e}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`\nJSON-LD OK on ${PAGES.length} pages.`);
}
