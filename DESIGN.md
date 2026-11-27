# MidiRoad design system

Generated with the ui-ux-pro-max skill (`--design-system`, query "music production beat maker marketplace") and adapted for MidiRoad: a store and free beat maker for trap and drill producers. Tokens live in `app/globals.css`; components use the token classes, never raw hex.

## UI style

**Warm paper.** Cream page, near-white cards, near-black ink, one forest green for every action. The palette is sampled from a light editorial reference, so the site reads like paper and ink rather than a lit screen. Flat surfaces with a 1px warm border; no gradients or glassmorphism. The kit cover artwork stays dark, so it reads like a record sleeve on a cream wall. Glow is reserved for things that are actually sounding (a note or playhead while a beat plays).

**Grain.** A static film grain sits over every page (`body::after` in `globals.css`): high-contrast grey noise blended with `overlay`, so it shows on the cream page and on the ink hero alike. It never takes clicks and is hidden in print. Strength is one token, `--grain-opacity` (0.2; about 0.08 is barely there, 0.22 is heavy film). It doesn't move, so it needs no reduced-motion handling.

**Night stage (home hero only).** The home page's nav and hero sit on ink (`.tone-night` in `globals.css`), so the six kit boxes read like a product launch. `.tone-night` redefines the colour tokens rather than adding new ones: inside it `background` is `#0D0F0C`, `card` `#151713`, `ink`/`foreground` cream `#F8F1E7`, `muted` `#B3A995`, `line` `#2A2D27`. Green as text on ink is `night-green` `#57D98A` (10.3:1); buttons keep brand green with cream text. Everything below the hero stays warm paper. The only decorative glow here is on the headline's "before you buy" and the soft green bloom behind the box stack.

## Color

| Role | Token | Hex | Use |
|---|---|---|---|
| Background | `background` | `#F8F1E7` | Page and hero sections |
| Alternate section | `canvas` | `#F1E8DA` | Every other home-page section, cover panels |
| Card | `card` | `#FEFAF7` | Cards, drawers, modals, inputs |
| Foreground | `foreground` / `ink` | `#1F1F1F` | Headings and body text |
| Muted text | `muted` | `#6B6357` | Secondary text (5.3:1 on background, 5.7:1 on card) |
| Border | `line` | `#E3D8C5` | Card and divider lines |
| Strong border | `strong` | `#B5A48F` | Outline buttons, hover borders, form fields |
| Primary | `primary` | `#2E6B45` | Selected chips and tabs, badges, secondary actions |
| Accent / CTA | `brand` | `#2E6B45` | Prices, Add to cart, Play. Text on it is `on-brand` `#FEFAF7` (6.1:1) |
| Destructive | `destructive` | `#B3261E` | Errors |

Every text pair clears WCAG AA: ink on background 14.7:1, muted on canvas 4.9:1, green on background 5.7:1, cream on green 6.1:1. Green buttons always use `text-on-brand`, never white-on-green. The logo tile is ink `#1F1F1F` with a cream road and green notes, matching the reference.

## Chart colors

Used for the beat maker's four lanes and the pattern waveforms. Each lane also has a text label, so color is never the only cue.

| Lane | Token | Hex |
|---|---|---|
| Hats | `chart-hats` | `#9B8CE8` |
| Snare / clap | `chart-snare` | `#D07BD4` |
| Kick | `chart-kick` | `#6A4CE8` |
| 808 | `chart-bass` | `#3F8F5E` |
| Waveform at rest | `chart-rest` | `#C2B6A2` (MidiKits) / `#C2B6A2` |
| Waveform played | – | `#2E6B45` |

The 808 lane is a mid green rather than the full brand green, so the dark note label stays readable on top of it. The beat maker and chord maker keep their lane colours even though they no longer sit on a dark panel.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display (h1, h2, logo) | Roboto 900 | Headings track tight so the weight still feels modern |
| Body, h3/h4, UI | Roboto 400/500/600/700 | |
| Numbers, prices, stats, BPM | Roboto 700, `tabular-nums` (`font-wide` utility) | |

- Minimum text size is 12px (`text-xs`). Body is 15–16px with 1.5–1.65 line height.
- Keep paragraphs under about 75 characters (`max-w-xl`).
- Sentence case everywhere; no all-caps labels.

## Spacing

A 4px base scale (Tailwind's default): 4, 8, 12, 16, 24, 32, 48, 64, 96.

- Inside components: 8–16px. Cards pad 16–24px.
- Between related blocks: 24–32px.
- Section padding: 80px mobile, 112px desktop (`py-20 md:py-28`).
- Content width: `max-w-6xl`, with a 20px side gutter on mobile.

## Buttons

Radius `rounded-key` (10px). Minimum height 44px for anything tapped often (36px allowed for secondary buttons inside cards).

| Kind | Classes | Use |
|---|---|---|
| CTA | `bg-brand text-on-brand hover:bg-brand-hover` | One per screen: Add to cart, Subscribe (featured), Play |
| Primary | `bg-primary text-on-brand hover:bg-primary-hover` | New beat, selected chip or tab |
| Outline | `border border-strong hover:bg-foreground/[0.06]` | Buy it now, Add to cart in grids, Show all |
| Ghost | `hover:bg-foreground/[0.03]` | Icon buttons, close |
| Play (beside a CTA) | `bg-ink text-card hover:bg-ink/85`, round, 60–64px | The hero player's Play. Ink, not green, so a buy button in the same view stays the only green action |

Focus: 2px `primary` outline, 2px offset, on every interactive element.

## Cards

`rounded-md` (6px) `border border-line bg-card`. No drop shadows on cards; use the border and the surface step (background → canvas → card) for depth. The active or featured card swaps its border to `brand`.

## Home hero

The home hero (`components/HomeHero.tsx`) is the night stage: the headline, price and Vault button on the left, and all six kit boxes (`VaultStack` with a floor reflection) on the right. On a phone the stack sits between the pitch and the price. It fits in the first screen on a 1440 × 900 desktop, with "Hear a pattern from every kit" starting just below it, which is where visitors press play. The featured-beat player bar that used to sit under the hero was removed on 27 Nov 2026.

- **One Vault offer per page:** the hero carries the `#main-cta` anchor, so every "Get the Vault" link lands on its price and button. Further down the home page, `KitShelf` (`#kits`) only sells the single kits: six boxes in one row on desktop, each with Play and Add to cart, plus a link to /kits. It doesn't repeat the Vault price, buttons or stats.

## Kit covers

`components/KitCover.tsx` draws all six kits as glossy product boxes in one series, all SVG (front 300 × 400, box 360 × 436), so they stay sharp from 64px in the cart to 400px on a kit page. Proposed and agreed on the design canvas ("Kit art, posters and waveforms", 26 Nov 2026).

- **Front, top band:** a 9px tracked small line in the kit's accent, then one Anton title at 64px forced to a fixed width with `textLength`, filled white fading to the accent and lit from behind by a blurred copy in the accent. Under it, "MIDI DRUM KIT · genre" at 7.5px.
- **Front, middle:** one glossy object per kit, with a soft bloom behind it: a chrome sun over a piano-roll road (Essentials), a vault dial under hazard tape (Heist), a ringed planet (Odyssey), a dripping cross (Psycho), a reticle with a radar sweep (Decoy), a speaker cone (Focus).
- **Front, label strip:** the same black strip on every box: `MIDIROAD`, a 16-step pattern in the accent and the catalogue number (`MR-001`–`MR-006`). No spec bands: pattern counts and BPM belong to the page.
- **Ground and finish:** the kit's `accent2` under a 50% ink wash, a vignette, a top scrim for the title, grain and a gloss sweep.
- **Box:** a 44px spine on the left with the title and number in the accent, a soft floor shadow, and on posters an optional floor reflection.
- `KitCover` is the box (grids, kit pages, cart). `BundleSpread` uses the flat front. `VaultStack` puts all six boxes in two rows (back: Heist, Odyssey, Psycho; front: Decoy, Essentials, Focus); `BundleCover` is that stack in a square, and the /kits "Best value" card shows it on an ink panel.

## Waveforms

One style everywhere: mirrored bars from the real audio peaks, `chart-rest` before play and `brand` green as it plays, with a 1.5px ink playhead while a pattern plays. Bars are fully rounded with a 2px minimum so quiet passages still read. On dark artwork (posters) the bars take the kit accent with a soft glow; that is the only place a waveform glows.

## Navigation

- Desktop: Kits, Patterns, Beat maker, Chord Maker, account, cart. No promo pill in the bar.
- Below `md` the inline links are hidden and `MobileNav` renders a menu button with a full-width panel: one row per destination with a one-line note, closed by the close button, Escape, a route change or a tap outside. Rows are 56px so every destination is a real tap target.
- The footer carries the whole sitemap, so nothing is reachable only through the menu.

## Pattern rows

On the home page `TrackTable` runs with `covers`: each row starts with its kit's box (desktop) and the kit name gets a dot in the kit's accent.


`TrackTable` is one grid template shared by a header row and every row, so the columns line up: play, pattern, kit, BPM, part, preview, download. Header labels are hidden below `md` (rows carry their own metadata line there). Play and download controls are 36px on desktop and 44px on touch. Titles render in sentence case even when the catalogue stores them lower case.

## Anti-patterns to avoid

- Pure white page or section backgrounds, or a cold blue-grey that fights the warm paper.
- White text on the green CTA.
- Righteous for numbers, prices, or anything under 20px.
- Text under 12px, or gray-on-gray below 4.5:1.
- More than one green CTA competing in the same view.
- Color as the only signal (lanes, active patterns and errors always have a label or icon).
- Emoji as icons; use the existing inline SVGs.
- Decorative glow, gradients or animation on things that aren't playing.
- Animations that ignore `prefers-reduced-motion`.
- Raw `text-white`, `bg-white/10` or `bg-black/20` utilities. Use the tokens; they now mean "light on paper", not "light on dark".
