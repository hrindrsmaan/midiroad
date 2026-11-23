This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## IndexNow (tell search engines about new pages)

[IndexNow](https://www.indexnow.org) pings Bing, Yandex, Seznam and Naver (and the AI search tools built on Bing's index, such as ChatGPT search and Copilot) when pages change.

- The key file is `public/6b8030468b8020792428d1dc16fe48b5.txt`, served at `https://midiroad.com/6b8030468b8020792428d1dc16fe48b5.txt`. Its contents must stay equal to the key in the script.
- After a production deploy that adds or changes pages, run:

```bash
npm run indexnow
```

It reads the live `https://midiroad.com/sitemap.xml` and POSTs every URL to `https://api.indexnow.org/indexnow`. A `200` or `202` means the URLs were accepted. To list the URLs without sending them, run `npm run indexnow -- --dry-run`. Set `SITEMAP_URL` to read a different sitemap.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
