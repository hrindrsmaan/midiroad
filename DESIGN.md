# MidiRoad design system

Generated with the ui-ux-pro-max skill (`--design-system`, query "music production beat maker marketplace") and adapted for MidiRoad: a store and free beat maker for trap and drill producers. Tokens live in `app/globals.css`; components use the token classes, never raw hex.

## UI style

**Warm paper.** Cream page, near-white cards, near-black ink, one forest green for every action. The palette is sampled from a light editorial reference, so the site reads like paper and ink rather than a lit screen. Flat surfaces with a 1px warm border; no gradients or glassmorphism. The kit cover artwork stays dark, so it reads like a record sleeve on a cream wall. Glow is reserved for things that are actually sounding (a note or playhead while a beat plays).

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

Focus: 2px `primary` outline, 2px offset, on every interactive element.

## Cards

`rounded-md` (6px) `border border-line bg-card`. No drop shadows on cards; use the border and the surface step (background → canvas → card) for depth. The active or featured card swaps its border to `brand`.

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
