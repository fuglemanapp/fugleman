# WhatSpent premium public landing — design

**Date:** 2026-09-01  
**Status:** Approved

## Objective

Replace the current short, editorial landing page with a complete public launch experience for WhatSpent. The page must communicate the full product with a premium visual standard, use the official WhatSpent identity, and lead visitors clearly to registration.

## Product truth to communicate

The landing will describe features that already exist in the product:

- Natural-language messages through the linked WhatsApp number.
- Financial transactions and monthly dashboard summaries.
- Credit-card purchases, installments, statement projections and payment tracking.
- Agenda and commitments, including calendar integration where configured.
- Tasks, projects, notes and files in the organization area.
- Private account, linked phone number and separate user access.

The product is free during validation. The page must not show prices, invented customer counts, bank integrations that are not active, guarantees, or financial advice claims.

## Creative direction

Use a bright, confident WhatSpent system: official green, deep forest green, warm white and pale green surfaces. Preserve the supplied official transparent wordmark and WS app icon. Avoid Fugleman branding, dark-purple styling, generic stock imagery and an overly sparse layout.

The page should feel like a polished consumer-product launch: expansive typography, dense but breathable content, layered panels, real UI-style previews and restrained motion only on opacity/transform.

## Page architecture

### 1. Sticky header

- Official wordmark.
- Desktop anchors: Como funciona, Finanças, Cartões, Agenda, Organização.
- Login and a prominent `Criar conta grátis` registration CTA.
- Mobile menu preserves the same destinations and CTA.

### 2. Hero: WhatsApp as the product entry point

- Eyebrow stating that WhatSpent works through WhatsApp.
- A clear headline about organizing money and routine without changing habits.
- Two CTAs: register and scroll to the explanation.
- Short proof row: WhatsApp messages, private dashboard, free validation.
- Large CSS phone mockup using the official WS icon and a realistic WhatsApp-style conversation. It should show a natural expense request, the resulting confirmation and an overview chip.

### 3. Product proof strip

Four compact, official-looking capability cards: financial overview, cards and statements, commitments, and organization. These serve as fast orientation before the deeper sections.

### 4. How it works

Three connected steps:

1. Send a message naturally.
2. WhatSpent interprets and organizes the information.
3. Review everything in the private web dashboard.

Each step has a distinct icon and a small visual state, avoiding vague marketing copy.

### 5. WhatsApp conversation showcase

A full-width, visually dominant phone/device section. It must emphasize that users can express intent naturally (for example an expense, a card reference or a commitment) rather than use a rigid command format. Include a secondary scenario tab or stacked cards for finance and agenda.

### 6. Financial dashboard showcase

A dashboard-style visual panel that reflects real app concepts: month totals, categories, entries and exits. Pair it with focused copy about clarity, not financial promises.

### 7. Official card and statement section

- Two or three stylized card surfaces, using the product's actual card language and colors.
- A statement projection preview showing purchase, installment and future invoice context.
- Explain that purchases and installments are positioned in the relevant statement month.

### 8. Agenda and organization split section

- Agenda preview: commitments, time, reminders and calendar connection where configured.
- Organization preview: projects, tasks, notes and files.
- Clear message that financial and routine information can coexist in one private workspace.

### 9. Shared workspace and privacy

Explain separate account access, linked WhatsApp number and private dashboard. Link to existing Terms and Privacy pages. Keep the language factual and avoid security certifications or unsupported guarantees.

### 10. FAQ

Answer practical questions:

- Do I need to install an app?
- How does WhatsApp connection work?
- Can I use the dashboard without a message?
- What can I organize?
- Is the current validation free?
- Where can I get support?

### 11. Final CTA and footer

A high-contrast final conversion block inviting registration, followed by official branding and all navigation/legal links.

## Interaction and accessibility

- All CTAs route to `/cadastro`; login routes to `/login`.
- Navigation anchors work without JavaScript.
- Phone/dashboard mockups are semantic, decorative where appropriate and readable at small widths.
- Respect reduced-motion preferences.
- Maintain keyboard-visible focus states, sufficient color contrast and 44px minimum interactive targets.

## Responsive behavior

- Desktop: editorial grid, device mockup alongside content and wide dashboard/card compositions.
- Tablet: stacked visual stories with controls remaining horizontally usable.
- Mobile: section order follows the product story; device mockup stays large enough to read; no horizontal scroll; CTA remains obvious.

## Verification

- Add/update component and page tests for visible user-facing claims, official assets, registration links, product sections and legal links.
- Run unit tests, lint and production build.
- Inspect at desktop and mobile viewport sizes, checking layout, scroll anchors, menu, CTA destinations and no console errors.
