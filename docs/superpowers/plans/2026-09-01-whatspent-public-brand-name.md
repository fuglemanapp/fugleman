# Whatspent Public Brand Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every public Whatspent page and its SEO metadata use the OAuth-approved spelling `Whatspent`.

**Architecture:** Create one small, framework-agnostic brand module in `src/lib` and import it into the public landing components, public legal pages, and root metadata. This keeps browser-visible copy, image accessibility labels, and metadata synchronized without changing routes, OAuth configuration, dashboard copy, or data flows.

**Tech Stack:** Next.js 15 App Router, TypeScript, React Server Components, `next/metadata`, Vitest, ESLint.

## Global Constraints

- The exact public name is `Whatspent` (capital W; all remaining letters lowercase).
- Keep existing official logo image assets unchanged.
- Do not change Google OAuth scopes, client configuration, routes, database schema, dashboard copy, environment variables, or WhatsApp configuration.
- Keep all public legal URLs unchanged: `/privacidade` and `/termos`.
- Preserve the current visual design; this change is copy and metadata only.

---

## File structure

- Create `src/lib/public-brand.ts`: authoritative public brand spelling for pages and metadata.
- Modify `src/app/layout.tsx`: consume the brand spelling in global title and description metadata.
- Modify `src/app/page.test.tsx`: verify the rendered landing keeps the OAuth-approved spelling.
- Modify `src/app/privacidade/page.tsx` and `src/app/termos/page.tsx`: consume the brand spelling in public legal copy.
- Modify `src/components/landing/landing-data.ts`, `landing-feature-grid.tsx`, `landing-footer.tsx`, `landing-header.tsx`, `landing-hero.tsx`, `landing-logo.tsx`, `landing-phone.tsx`, `landing-product-overview.tsx`, and `landing-product-showcases.tsx`: consume the brand spelling in public landing copy and accessibility labels.
- Modify `src/components/landing/landing-header.test.tsx` and `landing-phone.test.tsx`: assert the public spelling in rendered accessibility and mockup content.
- Create `src/lib/public-brand.test.ts`: lock the canonical value to the OAuth-approved spelling.

### Task 1: Define and apply the public brand name

**Files:**
- Create: `src/lib/public-brand.ts`
- Modify: `src/app/layout.tsx:18-26`
- Modify: `src/app/privacidade/page.tsx:1-18`
- Modify: `src/app/termos/page.tsx:1-20`
- Modify: `src/components/landing/landing-data.ts:1-75`
- Modify: `src/components/landing/landing-feature-grid.tsx:1-70`
- Modify: `src/components/landing/landing-footer.tsx:1-45`
- Modify: `src/components/landing/landing-header.tsx:1-30`
- Modify: `src/components/landing/landing-hero.tsx:1-70`
- Modify: `src/components/landing/landing-logo.tsx:1-20`
- Modify: `src/components/landing/landing-phone.tsx:1-70`
- Modify: `src/components/landing/landing-product-overview.tsx:1-55`
- Modify: `src/components/landing/landing-product-showcases.tsx:1-70`
- Test: `src/lib/public-brand.test.ts`

**Interfaces:**
- Consumes: no runtime input or external configuration.
- Produces: `PUBLIC_BRAND_NAME`, a string literal used by public server and client components.

- [ ] **Step 1: Write the failing canonical-name test**

Create `src/lib/public-brand.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PUBLIC_BRAND_NAME } from "./public-brand";

describe("PUBLIC_BRAND_NAME", () => {
  it("uses the OAuth-approved public spelling", () => {
    expect(PUBLIC_BRAND_NAME).toBe("Whatspent");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/lib/public-brand.test.ts`

Expected: FAIL because `./public-brand` does not exist.

- [ ] **Step 3: Add the canonical brand module**

Create `src/lib/public-brand.ts`:

```ts
export const PUBLIC_BRAND_NAME = "Whatspent" as const;
```

- [ ] **Step 4: Replace public hard-coded spellings with the shared value**

Import `PUBLIC_BRAND_NAME` from `@/lib/public-brand` in every file listed for this task. Replace only visible public copy and public `alt`/`aria-label` values. Use template literals where surrounding copy needs the name:

```tsx
<Link aria-label={`Página inicial do ${PUBLIC_BRAND_NAME}`} href="/">
  <Image alt={PUBLIC_BRAND_NAME} /* preserve existing image props */ />
</Link>
```

For metadata in `src/app/layout.tsx`, retain the current metadata shape and use the shared value:

```ts
title: {
  default: `${PUBLIC_BRAND_NAME} | Finanças e organização em família`,
  template: `%s | ${PUBLIC_BRAND_NAME}`,
},
description: `Organize finanças, agenda, tarefas e conversas privadas com o ${PUBLIC_BRAND_NAME}.`,
```

Do not change internal dashboard components, API routes, OAuth scopes, filenames, URLs, CSS class names, logo file paths, or technical identifiers containing `whatspent`.

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `npm test -- src/lib/public-brand.test.ts`

Expected: PASS with one test asserting `Whatspent`.

- [ ] **Step 6: Commit the implementation unit**

```bash
git add src/lib/public-brand.ts src/lib/public-brand.test.ts src/app/layout.tsx src/app/privacidade/page.tsx src/app/termos/page.tsx src/components/landing/landing-data.ts src/components/landing/landing-feature-grid.tsx src/components/landing/landing-footer.tsx src/components/landing/landing-header.tsx src/components/landing/landing-hero.tsx src/components/landing/landing-logo.tsx src/components/landing/landing-phone.tsx src/components/landing/landing-product-overview.tsx src/components/landing/landing-product-showcases.tsx
git commit -m "fix: align public Whatspent brand name"
```

### Task 2: Lock rendered public content and metadata against casing regressions

**Files:**
- Modify: `src/app/page.test.tsx:1-28`
- Modify: `src/components/landing/landing-header.test.tsx:1-19`
- Modify: `src/components/landing/landing-phone.test.tsx:1-18`
- Test: `src/app/page.test.tsx`, `src/components/landing/landing-header.test.tsx`, `src/components/landing/landing-phone.test.tsx`

**Interfaces:**
- Consumes: `PUBLIC_BRAND_NAME` from `src/lib/public-brand.ts` and the existing server-rendered landing components.
- Produces: regression coverage that fails when public HTML returns to `WhatSpent`.

- [ ] **Step 1: Write failing public-render assertions**

Update the existing tests to import `PUBLIC_BRAND_NAME` and assert the canonical value in rendered HTML. For example, in `src/app/page.test.tsx`:

```ts
import { PUBLIC_BRAND_NAME } from "@/lib/public-brand";

expect(html).toContain(`Como funciona o ${PUBLIC_BRAND_NAME}`);
expect(html).toContain(`O ${PUBLIC_BRAND_NAME} está gratuito durante a fase de validação.`);
expect(html).toContain(`alt="${PUBLIC_BRAND_NAME}"`);
expect(html).not.toContain("WhatSpent");
```

In `landing-header.test.tsx`, assert `alt="Whatspent"` through `PUBLIC_BRAND_NAME`. In `landing-phone.test.tsx`, assert the visible assistant name through `PUBLIC_BRAND_NAME` and assert `WhatSpent` is absent.

- [ ] **Step 2: Run the landing test set to verify it fails before the copy update is complete**

Run:

```bash
npm test -- src/app/page.test.tsx src/components/landing/landing-header.test.tsx src/components/landing/landing-phone.test.tsx
```

Expected: FAIL if any public component still renders `WhatSpent`.

- [ ] **Step 3: Complete the public-copy substitutions and keep technical names untouched**

Use the shared `PUBLIC_BRAND_NAME` in all task-1 public component references. Do not replace lower-case technical values such as `whatspent-theme`, `/brand/whatspent-icon.png`, `whatspent-wordmark`, `whatspent.com`, or CSS classes.

- [ ] **Step 4: Run all direct regression tests**

Run:

```bash
npm test -- src/lib/public-brand.test.ts src/app/page.test.tsx src/components/landing/landing-header.test.tsx src/components/landing/landing-phone.test.tsx
```

Expected: PASS with the public spelling present and the old camel-cased spelling absent from rendered public HTML.

- [ ] **Step 5: Run project checks**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit with code 0. The build must complete without metadata, route, or TypeScript errors.

- [ ] **Step 6: Inspect the production-equivalent output**

Run:

```bash
npm run start
```

In a separate terminal, run:

```bash
curl -fsS http://localhost:3000 | rg 'Whatspent|WhatSpent'
```

Expected: public HTML contains `Whatspent` and does not contain `WhatSpent`. Stop the local server after inspection.

- [ ] **Step 7: Commit the test and validation unit**

```bash
git add src/app/page.test.tsx src/components/landing/landing-header.test.tsx src/components/landing/landing-phone.test.tsx
git commit -m "test: prevent public brand casing regressions"
```

## Final verification checklist

- [ ] `git diff origin/main...HEAD --check` reports no whitespace errors.
- [ ] `git diff origin/main...HEAD` contains only the brand module, public copy, metadata, tests, and this plan/spec documentation.
- [ ] `/`, `/privacidade`, and `/termos` retain their existing paths and load successfully after deployment.
- [ ] Google OAuth app name remains `Whatspent`.
- [ ] After deploy, open Google Auth Platform → Branding → Ver problemas and select `Corrigi os problemas` to request a new brand verification.
