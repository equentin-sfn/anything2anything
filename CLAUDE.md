# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Anything2Anything is a unit converter web app with a scroll-wheel UI inspired by Braun industrial design. Built as a static Next.js site deployed to Vercel.

## Commands

- `npm run dev` — local dev server with Turbopack
- `npm run build` — production build (static export)
- `npm run start` — serve production build

No test or lint commands are configured.

## Architecture

**Two main source files:**
- `app/converter.tsx` — Main converter component (~1800 lines) containing ScrollWheel, CategoryNav, and ModeNav sub-components. All state is local React hooks (useState, useMemo, useRef, useCallback).
- `lib/units.ts` — Unit definitions (180+ units across 11 categories and 6 modes) and conversion logic. Conversions go through a base unit using `toBase` ratios, except temperature which uses dedicated formulas.

**App shell:**
- `app/layout.tsx` — Root layout with Google Fonts (Instrument Serif, DM Sans, JetBrains Mono, Jost)
- `app/page.tsx` — Home page composing the converter with branding
- `app/globals.css` — Tailwind 4 theme overrides, custom color palette, noise texture overlay

## Key Conventions

- **Static export** — `output: "export"` in next.config.ts, no server-side features
- **Path alias** — `@/*` maps to project root
- **Styling** — Tailwind CSS 4 with custom theme colors: surface `#C8CEC9`, panel `#F0EFEC`, ink `#1A1816`, accent `#C0582F`, muted `#6B655F`
- **Fonts** — Display: Instrument Serif, Body: DM Sans, Mono: JetBrains Mono, Logo: Jost
- **Package manager** — npm (no lockfile for pnpm/yarn)
- **Versioning** — Git commit SHA captured at build time via next.config.ts

## Unit System

Units have: `id`, `name`, `symbol`, `category`, `toBase` (conversion ratio), `mode` (context filter). Categories: length, mass, volume, temperature, time, area, speed, data, energy, angle, typography. Modes: all, kitchen, newsroom, fun, workshop, dev.

Key functions in `lib/units.ts`: `convert()`, `convertTemperature()`, `formatCompact()`, `formatResult()`, `getUnitsByCategory()`, `getUnitsByCategoryAndMode()`, `getAvailableModesForCategory()`.
