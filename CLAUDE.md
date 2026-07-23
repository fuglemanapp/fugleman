# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Dev Server**: `npm run dev` (uses Turbo for faster builds)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Start Prod**: `npm run start`

## Architecture & Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) using the **App Router** (`src/app/`).
- **Styling**: Tailwind CSS + PostCSS (`tailwind.config.ts`, `src/app/globals.css`).
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) located in `src/components/ui/`. Components like Button, Card, Input, Label are pre-installed.
- **Icons**: Lucide React.
- **Database**: Prisma ORM with PostgreSQL (`prisma/`) and NextAuth for authentication (`@auth/prisma-adapter`).

## Project Structure
- `src/app/`: Next.js App Router.
  - `src/app/page.tsx`: Landing Page (Fugleman). Sections include: Hero, Controle Financeiro, Agenda Inteligente, Open Finance, Drive Inteligente & Projetos, Conta Compartilhada, Oferta (Pricing), and Footer.
  - `src/app/dashboard/`: Dashboard interface with routes for organizational tools (`organizacao/`, `agenda/`), financial tools (`financeiro/`, `conta/`), settings (`cadastros/`), and help (`ajuda/`).
  - `src/app/api/`: API routes (including `webhook/` and `auth/`).
- `src/components/`: Reusable React components.
- `src/lib/`: Utility functions (e.g., `utils.ts` for `cn`).

## ECC Rules & Guidelines
This project adheres to the ECC rule framework configured globally (located in `~/.claude/rules/ecc/`). Claude must follow these rules automatically:
- **Coding Style**: Favor immutability, KISS, DRY, YAGNI. Keep components small, use early returns, and avoid deep nesting.
- **Design Quality**: Avoid generic templates. Emphasize hierarchy, depth, intentional spacing, and typography (see `web/design-quality.md`).
- **Performance**: Strict core web vitals targets. Animate only compositor-friendly properties (`transform`, `opacity`).
- **State & Data**: Persist shareable state in the URL. Use server components where appropriate in the Next.js App Router. 
- **Commits & PRs**: Follow conventional commits (`<type>: <description>`).

*Note: Since RTK is installed globally (Rust Token Killer), commands executed via hooks might be transparently routed through `rtk`.*
