# WhatSpent Premium Public Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a complete, responsive public WhatSpent landing page that accurately presents WhatsApp, finance, cards, agenda and organization, and drives visitors to free registration.

**Architecture:** Keep the landing server-rendered in focused components under src/components/landing. A single data module supplies factual copy and preview data. Dedicated presentational components render the WhatsApp device, capability/flow section, product previews and FAQ; src/app/page.tsx only composes them.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide React, Vitest, Next Image and Link.

## Global Constraints

- Use official assets only: /brand/whatspent-wordmark.png and /brand/whatspent-icon.png.
- Preserve landingBrand official green family; do not reintroduce Fugleman or purple page branding.
- Public copy is factual: no prices, fabricated metrics, inactive integrations, guarantees or financial-advice claims.
- Every primary CTA links to /cadastro; login links to /login.
- Preserve visible focus styles, semantic headings, 44px targets, high contrast and no essential motion.
- Decorative effects use only transform/opacity and must not create mobile horizontal overflow.
- Preserve the footer’s Termos, Privacidade and support links.

---

## File structure

- src/components/landing/landing-data.ts — readonly product and FAQ copy.
- src/components/landing/landing-phone.tsx — official WS-icon WhatsApp-style device preview.
- src/components/landing/landing-hero.tsx — premium hero and primary CTA.
- src/components/landing/landing-product-overview.tsx — capability cards and three-step flow.
- src/components/landing/landing-product-showcases.tsx — finance, cards, agenda and organization previews.
- src/components/landing/landing-faq.tsx — FAQ and closing CTA.
- src/components/landing/landing-header.tsx and landing-footer.tsx — full navigation and legal/product links.
- src/app/page.tsx — landing composition only.
- src/app/page.test.tsx and component tests — public-content, asset and navigation assertions.

### Task 1: Establish factual content and navigation

**Files:**
- Create: src/components/landing/landing-data.ts
- Modify: src/components/landing/landing-header.tsx
- Modify: src/components/landing/landing-header.test.tsx
- Modify: src/app/page.test.tsx

**Interfaces:**
- Produces readonly productCapabilities, journeySteps and faqItems.
- Header exposes #como-funciona, #financas, #cartoes, #agenda, #organizacao, /login and /cadastro.

- [ ] **Step 1: Write failing content/navigation tests**

    it("renders every public product area", () => {
      const html = renderToStaticMarkup(<Home />);
      expect(html).toContain("Finanças que você consegue enxergar");
      expect(html).toContain("Cartões sem surpresa no fechamento");
      expect(html).toContain("Agenda e organização no mesmo ritmo");
      expect(html).toContain("Como funciona o WhatSpent");
    });

    it("links the header to public sections and account paths", () => {
      const html = renderToStaticMarkup(<LandingHeader />);
      expect(html).toContain('href="#como-funciona"');
      expect(html).toContain('href="#organizacao"');
      expect(html).toContain('href="/login"');
      expect(html).toContain('href="/cadastro"');
    });

- [ ] **Step 2: Run focused tests**

Run: npm test -- src/app/page.test.tsx src/components/landing/landing-header.test.tsx
Expected: FAIL because the new claims, anchors and login link are absent.

- [ ] **Step 3: Implement the data module and header**

    export const productCapabilities = [
      { id: "financas", eyebrow: "Finanças", title: "Finanças que você consegue enxergar", text: "Lançamentos, categorias e o retrato do mês em um painel privado.", icon: "wallet" },
      { id: "cartoes", eyebrow: "Cartões", title: "Cartões sem surpresa no fechamento", text: "Acompanhe compras, parcelas e projeções das próximas faturas.", icon: "credit-card" },
      { id: "agenda", eyebrow: "Agenda", title: "Compromissos que não se perdem", text: "Registre compromissos e acompanhe sua rotina no mesmo espaço.", icon: "calendar" },
      { id: "organizacao", eyebrow: "Organização", title: "Projetos, tarefas, notas e arquivos", text: "Reúna as pendências que também fazem parte da sua vida financeira.", icon: "layers" },
    ] as const;

    export const journeySteps = [
      { number: "01", title: "Você manda uma mensagem", text: "Escreva como você fala: uma despesa, um cartão ou um compromisso." },
      { number: "02", title: "O WhatSpent organiza", text: "A conversa vira informação estruturada para você conferir." },
      { number: "03", title: "Você acompanha no painel", text: "Veja lançamentos, cartões e rotina no seu espaço privado." },
    ] as const;

    export const faqItems = [
      { question: "Preciso instalar um aplicativo?", answer: "Não. Você cria sua conta no site, vincula seu número no painel e conversa com o WhatSpent pelo WhatsApp." },
      { question: "Como conecto meu WhatsApp?", answer: "Depois de criar sua conta, você informa e valida o seu número no painel para conversar com o assistente." },
      { question: "Posso usar o painel sem mandar uma mensagem?", answer: "Sim. O painel é o seu espaço para consultar e organizar as informações da conta." },
      { question: "O que posso organizar?", answer: "Lançamentos financeiros, cartões, compromissos, tarefas, projetos, notas e arquivos." },
      { question: "O acesso é pago?", answer: "O WhatSpent está gratuito durante a fase de validação." },
      { question: "Onde consigo ajuda?", answer: "Você pode falar com o suporte pelo e-mail suporte@whatspent.com." },
    ] as const;

Update the header to use all five section anchors and show an Entrar link before the Criar conta grátis CTA. Hide only the anchor list on small screens.

- [ ] **Step 4: Verify and commit**

Run: npm test -- src/app/page.test.tsx src/components/landing/landing-header.test.tsx
Expected: PASS.

    git add src/components/landing/landing-data.ts src/components/landing/landing-header.tsx src/components/landing/landing-header.test.tsx src/app/page.test.tsx
    git commit -m "feat: add WhatSpent landing product foundation"

### Task 2: Build official WhatsApp phone and hero

**Files:**
- Create: src/components/landing/landing-phone.tsx
- Create: src/components/landing/landing-phone.test.tsx
- Modify: src/components/landing/landing-hero.tsx

**Interfaces:**
- LandingPhone({ scenario, compact }) accepts scenario: "finance" | "agenda" and optional compact?: boolean.
- Hero renders LandingPhone scenario="finance", /cadastro and #como-funciona links.

- [ ] **Step 1: Write a failing device test**

    it("shows an official WhatSpent WhatsApp finance conversation", () => {
      const html = renderToStaticMarkup(<LandingPhone scenario="finance" />);
      expect(html).toContain('src="/brand/whatspent-icon.png"');
      expect(html).toContain("Gastei 82 reais no mercado");
      expect(html).toContain("Registrei R$ 82,00 em Alimentação");
      expect(html).toContain("WhatSpent");
    });

- [ ] **Step 2: Run focused test**

Run: npm test -- src/components/landing/landing-phone.test.tsx
Expected: FAIL because LandingPhone does not exist.

- [ ] **Step 3: Implement reusable phone and hero**

    const scenarios = {
      finance: {
        outgoing: "Gastei 82 reais no mercado com o cartão.",
        response: "Registrei R$ 82,00 em Alimentação. Você acompanha esse gasto no painel quando quiser.",
        chip: "Lançamento organizado",
      },
      agenda: {
        outgoing: "Marca a consulta de quinta às 14h.",
        response: "Compromisso criado para quinta, 14h. Ele já aparece na sua agenda.",
        chip: "Agenda atualizada",
      },
    } as const;

Render a semantic div aria-label="Conversa demonstrativa no WhatsApp" with the official WS icon, dark device border, pale-green chat surface, outgoing/assistant bubbles and the scenario chip. Use max-w-[340px] and 14–16px message text. Do not use the WhatsApp wordmark or infer Meta endorsement.

Rewrite the hero with eyebrow Seu assistente no WhatsApp, headline Dinheiro e rotina, organizados em uma conversa., factual body text, primary Criar conta grátis CTA, secondary Entender como funciona link and proof row for messages, private dashboard and free validation.

- [ ] **Step 4: Verify and commit**

Run: npm test -- src/components/landing/landing-phone.test.tsx src/app/page.test.tsx && npm run lint
Expected: PASS with no lint warnings.

    git add src/components/landing/landing-phone.tsx src/components/landing/landing-phone.test.tsx src/components/landing/landing-hero.tsx src/app/page.test.tsx
    git commit -m "feat: add official WhatSpent phone experience"

### Task 3: Add capability, dashboard and card showcases

**Files:**
- Create: src/components/landing/landing-product-overview.tsx
- Create: src/components/landing/landing-product-showcases.tsx
- Create: src/components/landing/landing-product-showcases.test.tsx
- Modify: src/app/page.tsx

**Interfaces:**
- LandingProductOverview consumes productCapabilities and journeySteps.
- LandingProductShowcases emits sections with IDs financas, cartoes, agenda and organizacao.

- [ ] **Step 1: Write a failing showcase test**

    it("renders real previews for all product areas", () => {
      const html = renderToStaticMarkup(<LandingProductShowcases />);
      expect(html).toContain('id="financas"');
      expect(html).toContain('id="cartoes"');
      expect(html).toContain("Fatura projetada");
      expect(html).toContain("Próximos compromissos");
      expect(html).toContain("Projetos, tarefas, notas e arquivos");
    });

- [ ] **Step 2: Run focused test**

Run: npm test -- src/components/landing/landing-product-showcases.test.tsx
Expected: FAIL because the showcase component is absent.

- [ ] **Step 3: Implement product previews**

LandingProductOverview is a four-card strip using a local Lucide iconByName map and a section id="como-funciona" that maps the three exact journey steps.

LandingProductShowcases creates these semantic sections:

    <section id="financas" aria-labelledby="financas-title">
      <h2 id="financas-title">O retrato do mês, sem montar planilha.</h2>
      <div>Entradas R$ 4.820,00 · Saídas R$ 2.436,00 · Saldo do mês R$ 2.384,00</div>
      <div>Alimentação · Moradia · Transporte</div>
    </section>
    <section id="cartoes" aria-labelledby="cartoes-title">
      <h2 id="cartoes-title">Cada compra no mês que importa.</h2>
      <div>Cartão principal · •••• 2860 · Limite disponível R$ 8.500,00</div>
      <div>Fatura projetada · Vence em 17/09 · R$ 1.248,30</div>
    </section>
    <section id="agenda" aria-labelledby="agenda-title">
      <h2 id="agenda-title">Seu próximo compromisso não precisa ficar na cabeça.</h2>
      <ul><li>Consulta · quinta · 14h</li><li>Reunião · sexta · 10h</li><li>Lembrete · pagar fatura · dia 17</li></ul>
    </section>
    <section id="organizacao" aria-labelledby="organizacao-title">
      <h2 id="organizacao-title">Projetos, tarefas, notas e arquivos no mesmo espaço.</h2>
      <ul><li>Projeto: Casa em ordem</li><li>Tarefa: revisar orçamento</li><li>Nota: lista de prioridades</li><li>Arquivo: comprovante.pdf</li></ul>
    </section>

Preview values are demonstrative and not customer results. Card surfaces may use green, navy and plum as user-selectable card colors; page chrome stays WhatSpent green. Decorative lines/circles receive aria-hidden="true".

- [ ] **Step 4: Compose new landing sections**

Replace LandingFeatureGrid in src/app/page.tsx with:

    <LandingHero />
    <LandingProductOverview />
    <LandingProductShowcases />

Remove the unused historical LegacyFuglemanLanding function and its unused imports so inaccurate legacy brand copy is not retained in the source.

- [ ] **Step 5: Verify and commit**

Run: npm test -- src/components/landing/landing-product-showcases.test.tsx src/app/page.test.tsx && npm run lint
Expected: PASS.

    git add src/app/page.tsx src/components/landing/landing-product-overview.tsx src/components/landing/landing-product-showcases.tsx src/components/landing/landing-product-showcases.test.tsx
    git commit -m "feat: showcase WhatSpent product areas"

### Task 4: Finish FAQ, conversion, footer and quality gates

**Files:**
- Create: src/components/landing/landing-faq.tsx
- Modify: src/components/landing/landing-footer.tsx
- Modify: src/app/page.tsx
- Modify: src/app/page.test.tsx

**Interfaces:**
- LandingFaq consumes faqItems and renders FAQ plus final /cadastro CTA.
- Footer retains /login, /termos, /privacidade and mailto:suporte@whatspent.com.

- [ ] **Step 1: Write failing final-experience test**

    it("keeps free validation, FAQ and legal paths public", () => {
      const html = renderToStaticMarkup(<Home />);
      expect(html).toContain("O WhatSpent está gratuito durante a fase de validação.");
      expect(html).toContain("Preciso instalar um aplicativo?");
      expect(html).toContain('href="/termos"');
      expect(html).toContain('href="/privacidade"');
      expect(html).toContain('href="mailto:suporte@whatspent.com"');
    });

- [ ] **Step 2: Run the page test**

Run: npm test -- src/app/page.test.tsx
Expected: FAIL because the FAQ/final CTA are absent.

- [ ] **Step 3: Implement FAQ and CTA**

Render faqItems in a section aria-labelledby="faq-title" with a semantic dl. Add a high-contrast final section containing:

    <p>Comece pelo que já é seu</p>
    <h2>Sua rotina cabe em uma conversa.</h2>
    <p>Crie sua conta gratuita, conecte seu número e acompanhe tudo no seu painel.</p>
    <Link href="/cadastro">Criar conta grátis <ArrowUpRight aria-hidden="true" /></Link>

Mount LandingFaq after LandingProductShowcases. Add product anchors to the existing footer and preserve every existing login, legal and support path. Keep min-h-[44px] on interactive footer/header elements.

- [ ] **Step 4: Run automated quality gates**

Run: npm test && npm run lint && npm run build
Expected: all Vitest tests pass, ESLint exits 0 and the production build completes.

- [ ] **Step 5: Verify visual and interaction behavior**

Run a local production server and inspect at 1440px and 390px widths:

    Desktop: header anchors, large official phone, capability strip, finance/dashboard, card statement, agenda, organization, FAQ and footer are visible and unclipped.
    Mobile: no horizontal scroll; phone/cards readable; CTA targets tappable; anchors arrive at visible headings.
    Both: no console errors; /cadastro, /login, /termos and /privacidade return valid pages.

- [ ] **Step 6: Commit final experience**

    git add src/components/landing/landing-faq.tsx src/components/landing/landing-footer.tsx src/app/page.tsx src/app/page.test.tsx
    git commit -m "feat: complete WhatSpent public landing"

## Plan self-review

- Product truth, free validation and legal/privacy links are explicitly implemented in Tasks 1 and 4.
- The approved premium depth is covered by Tasks 2–4: official phone, four capability cards, how-it-works sequence, dashboard, card/statement, agenda, organization, FAQ and CTA.
- Tasks include focused test-first cycles, commands, commits and final desktop/mobile verification.
- Each component API, section identifier and public copy used by later tasks is defined above.
