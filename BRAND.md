# TradeCafe — Brand Spec

Pulled from `tailwind.config.js` and `src/index.css`. Use this to set up
Figma color styles, text styles, and effect styles.

---

## Logo

| Asset | Path | Use |
|---|---|---|
| Spiral mark (icon) | `/tradecafe-logo.svg` | App rail, notch pill, favicon |
| Wordmark | `/tradecafe-wordmark.svg?v=2` | Marketing nav, footer header |
| PNG mark | `/tradecafe-logo.png` | OG image, low-fi fallback |

The spiral mark always sits inside a teal ring on dark surfaces:
`bg rgba(34, 211, 180, 0.12)`, `border 1px rgba(34, 211, 180, 0.35)`,
`shadow 0 0 22px rgba(34, 211, 180, 0.22)`.

---

## Color

### Brand accents
| Token | Dark mode | Light mode | Notes |
|---|---|---|---|
| `tradeTeal` (primary) | `#00B4A6` | `#00897E` | All primary CTAs, signal lines, focus rings |
| `tradeTealLight` | `#5FE0CF` | `#00B4A6` | Hover, glow, secondary accent |
| `tradeOrange` | `#E8782A` | `#E8782A` | Secondary accent — sparingly |
| `tradeNavy` | `#1B3A5C` | `#1B3A5C` | Editorial dark blue, rarely used |

### Surfaces (dark)
| Token | Hex | Use |
|---|---|---|
| Page bg | `#02080A` | Outer page bg (--tc-bg) |
| Hero / app deep | `#020809` | Hero frame fill |
| `tradeBlack` | `#05080D` | Modal scrim, deepest fill |
| `tradePanel` | `#0B111A` | Panel chrome |
| `surface` | `#070D12` | Standard card/panel surface |

### Surfaces (light)
| Token | Hex |
|---|---|
| Page bg | `#E7ECEA` |
| Surface | `#FFFFFF` |

### Ink (text & borders)
Use as `rgb(255 255 255 / α)` on dark, `rgb(16 26 30 / α)` on light. Tier α by use:

| Use | Dark mode | Light mode |
|---|---|---|
| Display / primary | `#FFFFFF` | `#101A1E` |
| Body | `rgba(255,255,255,0.78)` | `rgba(16,26,30,0.85)` |
| Muted | `rgba(255,255,255,0.55)` | `rgba(16,26,30,0.55)` |
| Subtle | `rgba(255,255,255,0.35–0.45)` | `rgba(16,26,30,0.35–0.45)` |
| Hairline border | `rgba(255,255,255,0.05–0.08)` | `rgba(16,26,30,0.06–0.10)` |

`tradeWhite` token: `#F5F6F2` (warm off-white, body fallback)
`tradeGray`: `#9BA6B2`

### Market / state
| Use | Hex |
|---|---|
| Long / up | `#1FB8A6` |
| Long pastel (text on dark) | `#5FE0CF` |
| Short / down | `#F23645` |
| Short pastel (text on dark) | `#FF8A82` / `#FF9B91` (gradient end) |
| Warning | `#F0B90B` |

---

## Typography

### Families
```
Display / heading : Geist → Manrope → sans-serif
Body              : Geist → Manrope → sans-serif
Mono (eyebrow,    : JetBrains Mono → monospace
 ticks, numbers)
```

Google Fonts link (already in `public/index.html`):
```
Geist 300/400/500/600/700/800
Manrope 300/400/500/600/700/800
JetBrains Mono 400/500/600
```

### Type scale (responsive clamps used on the site)
| Style | Size | Weight | Tracking | Line-ht | Notes |
|---|---|---|---|---|---|
| Hero H1 | `clamp(30, 6.6vw, 84px)` | 600 | -0.045em | 1.02 | Italic light accent on a noun |
| Section H2 | `clamp(24, 5vw, 40px)` | 600 | -0.025em | 1.08 | Geist semibold |
| H3 / card title | 18–22px | 600 | -0.01em | 1.2 | |
| Body L | 16–17px | 400 | normal | 1.6 | Marketing copy |
| Body | 13.5–15px | 400 | normal | 1.55 | Card copy |
| Body S | 12–13px | 400 | normal | 1.5 | Footer / meta |
| Eyebrow (mono) | 10–10.5px | 500 | 0.22em | 1 | UPPERCASE |
| Tick / mono numbers | 10.5–13px | 500 | 0.04–0.16em | 1 | JetBrains Mono |

### Voice
Calm, intelligent, in-control. Late-night espresso, not casino neon.
Italic light weight on the noun that carries meaning — e.g. *"with you"*,
*"calmly"*, *"in control"*. Avoid hype, leverage-bait, "moonshot" language.

---

## Border radius

| Use | Value |
|---|---|
| Pill | `9999px` |
| Hero frame | `22 / 30px` (rounded-[22px] sm:rounded-[30px]) |
| Large card | `24px` (rounded-3xl) |
| Card | `16px` (rounded-2xl) |
| Inner panel | `12–14px` |
| Input / chip | `8–10px` |
| Notch shoulder cut | `22px` |

---

## Shadows & glow

| Use | Value |
|---|---|
| Card resting | `0 14px 40px rgba(0,0,0,0.35)` |
| Card lifted | `0 30px 80px -30px rgba(0,0,0,0.8)` |
| Hero device | `0 40px 120px -20px rgba(0,0,0,0.8)` |
| Teal halo | `0 0 22px rgba(34,211,180,0.22)` |
| Strong glow | `0 0 60px rgba(0,180,166,0.08)` |
| Inset hairline (top) | `inset 0 1px 0 rgba(255,255,255,0.06)` |

---

## Layout

| Token | Value |
|---|---|
| Max content width | `1280px` |
| Section side padding | `24 / 32 / 48px` (px-6 sm:px-8 lg:px-12) |
| Section vertical | `64–112px` (py-16 sm:py-28) |
| Card gap | `12 / 16 / 20px` |
| Stat strip column gap | `24px` |
| Inset gutter (hero) | `8 / 12px` (page-bg margin around rounded hero) |

---

## Motion

| Use | Duration / curve |
|---|---|
| Hover lift, color | 200ms ease-out |
| Tab pill expand | 480ms `cubic-bezier(.2,.7,.2,1)` |
| FAQ row open | 300ms ease-out |
| Marquee scroll | 26–38s linear, infinite |
| Pulse dot | 1.6s ease-in-out, infinite |
| Reduced motion | All scrolls + spins disabled |

---

## Components — Figma-ready references

- **Primary CTA** — `tradeTeal` fill, `#042024` text, pill radius, 14–16px text, mono uppercase tracking 0.1em; with `ArrowUpRight` lucide icon.
- **Ghost CTA** — transparent fill, `rgba(255,255,255,0.06)` border, body text colour 0.85α; same pill radius.
- **Eyebrow** — JetBrains Mono 10px, tracking 0.22em, `tradeTeal` 0.85α, uppercase, with optional `01 ·` index prefix.
- **Stat tile** — surface fill, hairline border, mono label 10.5px tracking 0.18em uppercase muted, Geist 28–34px semibold value.
- **Chip / pill** — `rgba(34,211,180,0.10–0.15)` fill, `rgba(34,211,180,0.25–0.35)` border, mono 10px tracking 0.14em uppercase teal.
- **Card** — surface `rgba(255,255,255,0.025)`, border `rgba(255,255,255,0.06)`, hover border `tradeTeal/35`.

---

## Brand do/don't

**Do**
- Pair Geist semibold display with mono UPPERCASE eyebrows
- Italic-light a single noun per headline to add cadence
- Use teal as the ONE accent — let it carry signal/CTA/data
- Stack hairline borders + soft inset highlights for depth

**Don't**
- Use marketing-template gradients (purple/pink/blue spectrum)
- Use multiple accent colors at once
- Apply teal to body text — keep it for accents and data
- Use drop-shadows on text or chrome bevels
