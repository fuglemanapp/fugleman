# WhatSpent Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the public WhatSpent landing into a premium product page using the official logo, icon, and green identity.

**Architecture:** Preserve URLs and product behavior. Replace only the landing presentation with focused components and transparent brand assets under `public/brand/`; dashboard styling remains independent.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Tailwind CSS, Lucide React, built-in image editing.

## Global Constraints

- Preserve `/cadastro`, `/login`, legal pages, and CTA destinations.
- Use only the official user-provided wordmark and WS icon.
- Store new transparent raster assets in `public/brand/` without overwriting originals.
- Use `#00C853`, `#087D3C`, `#063D24`, `#EAFBF0`, and `#F7FCF8` as landing palette values.
- Remove public Fugleman, purple, and pink accents.
- Keep horizontal document overflow disabled and validate at 390px.

---

### Task 1: Prepare transparent official brand assets

**Files:**
- Create: `public/brand/whatspent-wordmark.png`
- Create: `public/brand/whatspent-icon.png`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes the two user-supplied PNGs from `/Users/macbook/Downloads/`.
- Produces transparent PNGs served at `/brand/whatspent-wordmark.png` and `/brand/whatspent-icon.png`.

- [ ] **Step 1: Create transparent cutouts with the built-in image editor**

Use this exact request once per supplied image:

```text
Use case: background-extraction
Asset type: website brand asset
Primary request: remove only the white background and preserve the supplied official WhatSpent mark exactly
Constraints: transparent alpha background; preserve lettering, green color, proportions and edge quality; no crop, no shadow, no new text, no watermark
```

- [ ] **Step 2: Add selected assets to the project and wire the app icon**

```ts
export const metadata: Metadata = {
  icons: { icon: "/brand/whatspent-icon.png" },
};
```

- [ ] **Step 3: Validate alpha and commit**

Run: `file public/brand/whatspent-wordmark.png public/brand/whatspent-icon.png`

Expected: both are PNG assets with transparent backgrounds.

```bash
git add public/brand src/app/layout.tsx
git commit -m "feat: add official WhatSpent brand assets"
```

### Task 2: Establish landing-only premium design tokens

**Files:**
- Create: `src/components/landing/landing-brand.ts`
- Create: `src/components/landing/landing-brand.test.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces `landingBrand`, consumed by landing components.

- [ ] **Step 1: Write the failing token test**

```ts
import { describe, expect, it } from "vitest";
import { landingBrand } from "./landing-brand";

describe("landingBrand", () => {
  it("uses the official green family", () => {
    expect(landingBrand.primary).toBe("#00C853");
    expect(landingBrand.ink).toBe("#063D24");
  });
});
```

- [ ] **Step 2: Run the test and add the minimal token module**

Run: `npm test -- src/components/landing/landing-brand.test.ts`

Expected before implementation: FAIL because `landing-brand.ts` does not exist.

```ts
export const landingBrand = {
  primary: "#00C853",
  deep: "#087D3C",
  ink: "#063D24",
  mist: "#EAFBF0",
  canvas: "#F7FCF8",
} as const;
```

Add `.landing-page { background: #F7FCF8; color: #063D24; }` to `globals.css`; retain `html, body { overflow-x: hidden; }`.

- [ ] **Step 3: Verify and commit**

Run: `npm test -- src/components/landing/landing-brand.test.ts`

Expected: PASS.

```bash
git add src/app/globals.css src/components/landing/landing-brand.ts src/components/landing/landing-brand.test.ts
git commit -m "feat: define WhatSpent landing design tokens"
```

### Task 3: Build reusable premium landing primitives

**Files:**
- Create: `src/components/landing/landing-logo.tsx`
- Create: `src/components/landing/landing-header.tsx`
- Create: `src/components/landing/landing-hero.tsx`
- Create: `src/components/landing/landing-feature-grid.tsx`
- Create: `src/components/landing/landing-footer.tsx`
- Create: `src/components/landing/landing-shell.test.tsx`

**Interfaces:**
- `LandingLogo({ inverted?: boolean; className?: string })` renders the official image with `alt="WhatSpent"`.
- `LandingHeader()`, `LandingHero()`, `LandingFeatureGrid()`, and `LandingFooter()` own only visual sections.

- [ ] **Step 1: Write the failing branded navigation test**

```tsx
import { render, screen } from "@testing-library/react";
import { LandingHeader } from "./landing-header";

it("uses the official wordmark and signup CTA", () => {
  render(<LandingHeader />);
  expect(screen.getByAltText("WhatSpent")).toHaveAttribute("src", expect.stringContaining("whatspent-wordmark"));
  expect(screen.getByRole("link", { name: /criar conta grátis/i })).toHaveAttribute("href", "/cadastro");
});
```

- [ ] **Step 2: Run the test before implementing components**

Run: `npm test -- src/components/landing/landing-shell.test.tsx`

Expected: FAIL because `LandingHeader` does not exist.

- [ ] **Step 3: Implement the visual primitives**

```tsx
export function LandingLogo({ className }: { className?: string }) {
  return <Image alt="WhatSpent" className={className} height={42} priority src="/brand/whatspent-wordmark.png" width={198} />;
}
```

Header: white sticky surface, official wordmark, four desktop anchors, single green CTA. Hero: editorial headline, generous whitespace, soft green radial glow, clear CTA, and a polished WhatsApp/panel product mockup using the official WS icon. Feature cards: only truthful WhatsApp, finance, and agenda capabilities. Footer: official wordmark, login, terms, privacy, and support links.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- src/components/landing/landing-shell.test.tsx`

Expected: PASS.

```bash
git add src/components/landing
git commit -m "feat: build premium WhatSpent landing components"
```

### Task 4: Replace the public landing composition

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`

**Interfaces:**
- Consumes the four landing section components.
- Preserves `#funcionalidades`, `#agenda`, `#cartoes`, and `#como-comecar` anchors.

- [ ] **Step 1: Write the landing regression test**

```tsx
import { render, screen } from "@testing-library/react";
import Home from "./page";

it("renders the official brand without legacy copy", () => {
  render(<Home />);
  expect(screen.getByAltText("WhatSpent")).toBeInTheDocument();
  expect(screen.queryByText(/Fugleman/i)).not.toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /criar conta grátis/i })[0]).toHaveAttribute("href", "/cadastro");
});
```

- [ ] **Step 2: Verify the test fails before composition replacement**

Run: `npm test -- src/app/page.test.tsx`

Expected: FAIL until the new components are connected.

- [ ] **Step 3: Replace page body with a small composition**

```tsx
export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-x-clip">
      <LandingHeader />
      <LandingHero />
      <LandingFeatureGrid />
      <LandingFooter />
    </main>
  );
}
```

Keep current truthful free-validation, WhatsApp linking, card, agenda, legal, and privacy copy. Remove black Fugleman-style presentation and all purple/pink decoration.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- src/app/page.test.tsx && npm run lint && npx tsc --noEmit`

Expected: all commands pass.

```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: redesign public WhatSpent landing"
```

### Task 5: Perform release-quality visual and production verification

**Files:**
- Create: `docs/qa/2026-09-01-whatspent-brand-refresh.md`

**Interfaces:**
- Consumes the deployed preview and production URLs.
- Produces an auditable release checklist.

- [ ] **Step 1: Run automated validation**

Run: `npm run lint && npx tsc --noEmit && npm test && npm run build && npm audit --omit=dev --audit-level=high`

Expected: no lint/type/build failures, all tests pass, and no high production dependency vulnerabilities.

- [ ] **Step 2: Perform browser validation**

Inspect `/`, `/cadastro`, `/login`, `/termos`, `/privacidade`, and `/dashboard` at 1440px and 390px. Confirm no white rectangle behind either brand asset, no Fugleman text, no purple/pink accent, working CTA links, no horizontal document overflow, and unauthenticated dashboard redirect to `/login?callbackUrl=%2Fdashboard`.

- [ ] **Step 3: Publish the verified branch**

Run: `git push -u origin codex/whatspent-brand-refresh`

Run: `gh pr create --base main --head codex/whatspent-brand-refresh --title "feat: refresh WhatSpent brand landing"`

Run: `gh pr checks --watch`

Expected: Vercel preview is Ready before merge.

- [ ] **Step 4: Confirm production and record checks**

Run: `curl -I https://whatspent.com/`

Run: `curl -I https://whatspent.com/cadastro`

Expected: both return HTTP 200 after merge.

Record every result in `docs/qa/2026-09-01-whatspent-brand-refresh.md` and commit it:

```bash
git add docs/qa/2026-09-01-whatspent-brand-refresh.md
git commit -m "docs: record WhatSpent brand release checks"
```
