# DiaCorp Energy — Software Thesis

A trilingual (Français · English · العربية) pitch web app presenting ten software platforms that turn DiaCorp Energy's 1 GW solar build-out in Morocco into a $2.67B-revenue / $15B-valuation platform by 2031 — by disintermediating ONEE and delivering the cheapest green energy in the country.

Live pitch: **[diacorp-pitch.vercel.app](https://diacorp-pitch.vercel.app)**

## What this is

This is a visual prototype, not production code. Each of the ten strategies is rendered as a realistic UI mockup inline, so the DiaCorp board can see — at a glance — what every product would look like before a line of production code is written.

The ten platforms:

| #   | Platform                       | Y5 rev   | Phase |
| --- | ------------------------------ | -------- | ----- |
| 01  | Hyperscale AI Colocation       | $1.2B    | 2     |
| 02  | Spot Energy Market             | $180M    | 1     |
| 03  | Tokenized Carbon Credits       | $140M    | 1     |
| 04  | Predictive O&M Digital Twin    | $85M     | 1     |
| 05  | Green Industrial Zone ERP      | $95M     | 2     |
| 06  | Green H₂ Optimizer             | $320M    | 3     |
| 07  | RL-Driven BESS Arbitrage       | $60M     | 1     |
| 08  | Corporate PPA Marketplace      | $70M     | 2     |
| 09  | B2C Solar-as-a-Service         | $480M    | 3     |
| 10  | Solar Site Intelligence (GIS)  | $45M     | 1     |

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- `next-intl` v4 for i18n (static route prefix `/fr`, `/en`, `/ar`)
- Tailwind CSS v4
- Custom design system (Fraunces · Archivo · IBM Plex Mono · IBM Plex Sans Arabic · Noto Kufi Arabic)

## Run locally

```bash
npm install
npm run dev
# then open http://localhost:3000
```

Default locale is `fr`. Root path redirects to `/fr`; switch with the top-right toggle.

## Structure

```
src/
  app/[locale]/        Locale-scoped layout + page
  components/          Section components (Hero, Thesis, …)
  components/mockups/  Ten hand-rendered UI mockups
  i18n/                Routing + request config
  lib/strategies.ts    Strategy metadata (revenue, margins, capex, tags)
  messages/            fr.json · en.json · ar.json
  proxy.ts             next-intl middleware (renamed `proxy` per Next 16)
```

## Content source

Adapted from the DiaCorp Energy Information Memorandum (July 2018, updated April 2026) and an analysis of Moroccan energy market structure, ONEE tariff data, and published CBAM regulations.

---

Strictly confidential · DiaCorp Energy internal use.
