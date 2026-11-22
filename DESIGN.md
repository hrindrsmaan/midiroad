# MidiRoad design system

Generated with the ui-ux-pro-max skill (`--design-system`, query "music production beat maker marketplace") and adapted for MidiRoad: a store and free beat maker for trap and drill producers. Tokens live in `app/globals.css`; components use the token classes, never raw hex.

## UI style

**Dark mode (studio).** Deep navy surfaces, light text, one green action per screen. Producers work in dark DAWs late at night, so the site matches the room they're in. Flat surfaces with a 1px light border; no gradients or glassmorphism. Glow is reserved for things that are actually sounding (a note or playhead while a beat plays).

## Color

| Role | Token | Hex | Use |
|---|---|---|---|
| Background | `background` | `#0F172A` | Page and hero sections |
| Alternate section | `canvas` | `#131B2F` | Every other home-page section, cover panels |
| Card | `card` | `#192134` | Cards, drawers, modals, inputs |
| Foreground | `foreground` / `ink` | `#F8FAFC` | Headings and body text |
| Muted text | `muted` | `#94A3B8` | Secondary text (7.0:1 on background, 6.3:1 on card) |
| Border | `line` | `rgb(255 255 255 / 0.08)` | Card and divider lines |
| Strong border | `strong` | `rgb(255 255 255 / 0.2)` | Outline buttons, hover borders |
| Primary | `primary` | `#7C3AED` | Selected chips and tabs, focus ring, secondary actions, logo tile |
| Accent / CTA | `brand` | `#22C55E` | Prices, Add to cart, Play. Text on it is `on-brand` `#0F172A` (7.8:1) |
| Destructive | `destructive` | `#DC2626` | Errors |

White text on the green CTA fails contrast (2.3:1), so green buttons always use `text-on-brand`. White on primary passes (5.7:1).

## Chart colors

Used for the beat maker's four lanes and the pattern waveforms. Each lane also has a text label, so color is never the only cue.

| Lane | Token | Hex |
|---|---|---|
| Hats | `chart-hats` | `#A5B4FC` |
| Snare / clap | `chart-snare` | `#C084FC` |
| Kick | `chart-kick` | `#6366F1` |
| 808 | `chart-bass` | `#22C55E` |
| Waveform at rest | `chart-rest` | `#64748B` (MidiKits) / `#475569` |
| Waveform played | – | `#22C55E` |

## Typography

| Role | Font | Notes |
|---|---|---|
| Display (h1, h2, logo) | Righteous 400 | Only at 20px and up |
| Body, h3/h4, UI | Poppins 400/500/600/700 | |
| Numbers, prices, stats, BPM | Poppins 700, `tabular-nums` (`font-wide` utility) | Righteous numerals are too stylized to read at a glance |

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
| Primary | `bg-primary text-white hover:bg-primary-hover` | New beat, selected chip or tab |
| Outline | `border border-strong hover:bg-white/10` | Buy it now, Add to cart in grids, Show all |
| Ghost | `hover:bg-white/5` | Icon buttons, close |

Focus: 2px `primary` outline, 2px offset, on every interactive element.

## Cards

`rounded-md` (6px) `border border-line bg-card`. No drop shadows on cards; use the border and the surface step (background → canvas → card) for depth. The active or featured card swaps its border to `brand`.

## Anti-patterns to avoid

- Pure white page or section backgrounds (the skill's main anti-pattern for this style).
- White text on the green CTA.
- Righteous for numbers, prices, or anything under 20px.
- Text under 12px, or gray-on-gray below 4.5:1.
- More than one green CTA competing in the same view.
- Color as the only signal (lanes, active patterns and errors always have a label or icon).
- Emoji as icons; use the existing inline SVGs.
- Decorative glow, gradients or animation on things that aren't playing.
- Animations that ignore `prefers-reduced-motion`.
