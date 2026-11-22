# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Trap, drill and RnB producers, from bedroom beginners to working producers selling beats; neither group comes first. They make beats in a DAW (FL Studio, Ableton, Logic) and come to MidiRoad to start a beat faster with ready-made drum patterns instead of programming hats, kicks and 808s from scratch. Beginners need reassurance that the files are easy to use; experienced producers want speed and a deep library.

## Product Purpose

MidiRoad sells royalty-free MIDI drum kits and gives away a browser beat maker. A visitor should be able to hear exactly what they'd get, make something in the browser, and leave with MIDI they can drag straight into their DAW. Success is a producer who buys a kit or the bundle, or signs up and spends credits, and comes back for more patterns.

## Positioning

- **Hear before buying.** Every one of the MIDI patterns is playable on the site, played through the bundle's own one-shots, before anyone pays.
- **Free beat maker.** Generate a full trap beat in the browser, shape tempo, key, sounds and mutes, and download the whole beat or a single lane as MIDI.
- **Cheap and royalty-free.** Low per-kit prices, a bundle at a large discount on the kits bought separately, and no royalties or clearance on anything released with the files.

## Operating Context

- Producers listen on the site, then work in their DAW; the hand-off is a downloaded `.mid` file (single files, or a zip for kits and the bundle).
- Downloads from the beat maker and the pattern library cost credits; new accounts get free credits, and monthly or yearly plans add more. Kits and the bundle are one-time purchases through Stripe.
- Sign-in is a passwordless email link (Google sign-in when configured). Purchases are delivered by email and on the order page.
- Traffic sources: unconfirmed. The testimonials are YouTube comments, so some visitors likely come from YouTube.

## Capabilities and Constraints

- Store: 6 MIDI kits plus "The Complete Vault" bundle (every kit plus drum one-shots that are only in the bundle). Prices, counts and kit data live in `lib/products.ts`, `lib/bundle.ts` and `lib/pricing.ts`.
- Pattern library: every pattern grouped by drum part (kicks, snares, hi-hats, open hats, 808s) and by kit, playable and downloadable per file (`components/MidiKits.tsx`, `/library`).
- Beat maker: deterministic generated beats, 50-beat history, per-lane sound picks, mute, per-lane and full MIDI download (`components/MidiGenerator.tsx`).
- Credits and plans: Starter, Producer, Studio, monthly or yearly (`lib/plans.ts`, `/pricing`).
- Cart, Stripe checkout, account page, order success page, transactional emails.
- Stack: Next.js (App Router), Tailwind CSS v4, Neon Postgres with Drizzle, Better Auth, Stripe, Resend.
- Terminology: "MIDI kit", "MIDI pack", "bundle", "one-shots", "patterns", "credits", "beat maker".

## Brand Commitments

None binding. Existing assets: the MidiRoad name and road/piano-roll logo (`components/Logo.tsx`, `app/icon.svg`) and the six kit cover artworks (`components/KitCover.tsx`, `public/images`). The user said none of these are fixed.

## Evidence on Hand

- Real YouTube comments from producers, with handles and avatars (`lib/testimonials.ts`).
- Audio previews for every kit (`public/previews`) and every MIDI pattern, playable on the site.
- FAQ answers on DAW support, beginner use, licensing, delivery and refunds (`lib/faq.ts`).
- Not on hand, so never invent: sales or download counts, customer numbers, ratings, star reviews, artist placements or endorsements, press, or label/customer logos.

## Product Principles

1. Let people hear it first. Sound is the proof; put playable audio ahead of claims.
2. Get producers to their DAW fast. Every path should end in a file they can drag in.
3. Serve beginners and pros on the same page: plain language and reassurance without slowing down someone who already knows what they want.
4. Value is part of the pitch. Make prices, the bundle saving and royalty-free use easy to see; never hide costs or credit use.
5. Only real proof. Use the comments, previews and facts that exist.
