# Public Launch Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open free individual WhatSpent accounts with verified e-mail and WhatsApp ownership, protected personal data, and public privacy controls.

**Architecture:** This release is split into independently deployable slices: account identity, phone ownership, public communication, and database isolation. HTTP routes enforce authentication and ownership first; PostgreSQL RLS becomes the independent second layer only after the application uses a non-owner database role and establishes a user context inside each transaction.

**Tech Stack:** Next.js 15 App Router, NextAuth v4, Prisma 5, PostgreSQL/Neon, Resend, Zernio WhatsApp webhooks, Vitest, Sentry and Vercel Firewall.

## Global Constraints

- The product is free during this validation phase; no price, plan or subscription CTA is shown to a visitor.
- The controller name is Lucas Simioni and the public privacy/support address is `suporte@whatspent.com`; no personal CPF is rendered or committed.
- Never attach a WhatsApp number merely because it was typed in the panel; only an inbound message from that number can complete the link.
- Do not activate PostgreSQL RLS while `DATABASE_URL` is an owner or bypass-RLS role.
- The app database role has `NOBYPASSRLS`; migrations, privileged maintenance and webhook-only operations use an explicitly separated service connection.
- Do not send financial values, messages, access tokens, cookies, phone numbers or e-mail addresses to Sentry.
- Belvo/Open Finance remains disabled until its production approval exists.
- Every behavior change starts with a focused failing Vitest test; run the relevant test, then the full test suite and `npm run build` before each PR.

---

## File structure and delivery order

| Slice | Main files | Independent outcome |
| --- | --- | --- |
| Account identity | `prisma/schema.prisma`, `src/lib/account-tokens.ts`, `src/lib/account-email.ts`, `src/app/api/auth/*`, `src/app/(public)/*` | A new person can create, confirm, sign in to and recover an account. |
| Phone ownership | `src/lib/phone-verification.ts`, `src/app/api/assistant/whatsapp-phone/route.ts`, `src/app/api/webhook/whatsapp/route.ts`, `src/components/account/whatsapp-link-card.tsx` | A WhatsApp agent is uniquely and verifiably tied to one account. |
| Public communication | `src/app/page.tsx`, `src/app/termos/page.tsx`, `src/app/privacidade/page.tsx`, `src/app/excluir-conta/page.tsx` | The public product is clearly free and contains accessible privacy controls. |
| Data isolation | `src/lib/db-context.ts`, `src/lib/prisma.ts`, `src/lib/prisma-service.ts`, `prisma/migrations/*`, route/service refactors | A restricted role and RLS independently reject cross-account database access. |

## Task 1: Add account-token persistence and validated input helpers

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_public_account_tokens/migration.sql`
- Create: `src/lib/account-input.ts`
- Create: `src/lib/account-input.test.ts`
- Create: `src/lib/account-tokens.ts`
- Create: `src/lib/account-tokens.test.ts`

**Interfaces:**
- Produces `validateRegistrationInput(input): { ok: true; value: RegistrationInput } | { ok: false; error: string }`.
- Produces `createOpaqueToken(): { plain: string; hash: string }` and `hashOpaqueToken(value: string): string`.
- Produces `EmailVerificationToken`, `PasswordResetToken`, `PhoneVerification` Prisma models with hashed, single-use, expiring values.

- [ ] **Step 1: Write failing input and token tests**

```ts
import { describe, expect, it } from "vitest";
import { validateRegistrationInput } from "./account-input";
import { createOpaqueToken, hashOpaqueToken } from "./account-tokens";

describe("validateRegistrationInput", () => {
  it("normalizes a valid address and accepts a 12-character password", () => {
    expect(validateRegistrationInput({ name: " Ana ", email: " ANA@EXAMPLE.COM ", password: "senha-segura12" }))
      .toEqual({ ok: true, value: { name: "Ana", email: "ana@example.com", password: "senha-segura12" } });
  });

  it("rejects a short password without returning the entered value", () => {
    expect(validateRegistrationInput({ name: "Ana", email: "ana@example.com", password: "curta" }))
      .toEqual({ ok: false, error: "Use uma senha com pelo menos 12 caracteres." });
  });
});

describe("opaque tokens", () => {
  it("stores a deterministic hash but generates an unpredictable plaintext token", () => {
    const token = createOpaqueToken();
    expect(token.plain).not.toBe(token.hash);
    expect(hashOpaqueToken(token.plain)).toBe(token.hash);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/account-input.test.ts src/lib/account-tokens.test.ts`

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Add the schema and minimal helpers**

Append relations to `User` and create the three models below. Store no plaintext code or token.

```prisma
emailVerificationTokens EmailVerificationToken[]
passwordResetTokens     PasswordResetToken[]
phoneVerifications     PhoneVerification[]

model EmailVerificationToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, expiresAt])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, expiresAt])
}

model PhoneVerification {
  id        String   @id @default(cuid())
  userId    String
  phone     String   @unique
  codeHash  String
  expiresAt DateTime
  verifiedAt DateTime?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, expiresAt])
}
```

Implement input normalization with `new URL`-free e-mail checks, name length 2–120 and password length at least 12. Implement opaque values with `randomBytes(32)` and `createHash("sha256")` from `node:crypto`.

- [ ] **Step 4: Generate and validate Prisma, then make tests pass**

Run: `npx prisma migrate dev --name add_public_account_tokens && npm test -- src/lib/account-input.test.ts src/lib/account-tokens.test.ts && npm run db:validate`

Expected: migration is generated; all named tests and schema validation pass.

- [ ] **Step 5: Commit the slice**

```bash
git add prisma src/lib/account-input.ts src/lib/account-input.test.ts src/lib/account-tokens.ts src/lib/account-tokens.test.ts
git commit -m "feat: add public account verification tokens"
```

## Task 2: Implement registration, e-mail confirmation and password recovery

**Files:**
- Create: `src/lib/account-email.ts`
- Create: `src/lib/account-email.test.ts`
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/auth/verify-email/route.ts`
- Create: `src/app/api/auth/password-reset/route.ts`
- Create: `src/app/api/auth/password-reset/confirm/route.ts`
- Create: `src/app/api/auth/public-auth.test.ts`
- Modify: `src/lib/auth.ts`
- Modify: `.env.example`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Consumes Task 1 input and token functions.
- Produces `sendAccountEmail({ to, subject, html }): Promise<void>` using `RESEND_API_KEY`, `EMAIL_FROM` and `NEXTAUTH_URL`.
- Credentials authorization rejects a password account until `emailVerified` is non-null.

- [ ] **Step 1: Write failing route and authorization tests**

```ts
it("creates an unverified account and sends a verification link", async () => {
  const response = await POST(new Request("http://localhost/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Ana", email: "ana@example.com", password: "senha-segura12" }),
  }));
  expect(response.status).toBe(201);
  expect(sendAccountEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "ana@example.com" }));
});

it("returns the same reset response for an unknown e-mail", async () => {
  const response = await passwordResetPOST(new Request("http://localhost/api/auth/password-reset", {
    method: "POST", body: JSON.stringify({ email: "missing@example.com" }),
  }));
  await expect(response.json()).resolves.toEqual({ ok: true });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/app/api/auth/public-auth.test.ts src/lib/account-email.test.ts`

Expected: FAIL because the public routes and mail adapter do not exist.

- [ ] **Step 3: Add the mail adapter and four routes**

Install `resend`. The adapter returns without sending only in `NODE_ENV === "test"`; in production it throws a configuration error if `RESEND_API_KEY` or `EMAIL_FROM` is absent. Each route obtains `getClientKey(request)` from a new `src/lib/request-client.ts`, rate-limits both IP and e-mail hashes through `consumeRateLimit`, and returns Portuguese generic messages.

Registration creates `User` with `passwordHash: await hashPassword(password)` and `emailVerified: null`, replaces unconsumed verification tokens for that user, then sends:

```ts
const verifyUrl = new URL("/verificar-email", process.env.NEXTAUTH_URL);
verifyUrl.searchParams.set("token", plainToken);
```

Verification consumes a hash-matched, unexpired, unused token in one transaction, sets `User.emailVerified`, and marks the token used. Reset confirmation consumes the token once and updates `passwordHash`; it also deletes every `Session` for the user. Update `authorize` in `src/lib/auth.ts` to select `emailVerified` and return `null` if it is absent.

- [ ] **Step 4: Add environment documentation and pass the focused tests**

Add only names, never values, to `.env.example`:

```dotenv
RESEND_API_KEY=
EMAIL_FROM="WhatSpent <suporte@whatspent.com>"
NEXTAUTH_URL=https://whatspent.com
```

Run: `npm test -- src/app/api/auth/public-auth.test.ts src/lib/account-email.test.ts`

Expected: PASS, including the unknown-e-mail reset response and unverified-login rejection.

- [ ] **Step 5: Commit the slice**

```bash
git add package.json package-lock.json .env.example src/lib src/app/api/auth prisma
git commit -m "feat: add verified public accounts"
```

## Task 3: Add public account screens and protected onboarding

**Files:**
- Create: `src/app/cadastro/page.tsx`
- Create: `src/app/entrar/page.tsx`
- Create: `src/app/verificar-email/page.tsx`
- Create: `src/app/recuperar-senha/page.tsx`
- Create: `src/app/redefinir-senha/page.tsx`
- Create: `src/components/auth/public-auth-form.tsx`
- Create: `src/components/account/public-onboarding.tsx`
- Modify: `src/app/dashboard/layout.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/auth/public-auth-form.test.tsx`

**Interfaces:**
- Consumes Task 2 endpoints.
- Produces authenticated navigation to `/dashboard`, and a dismissible onboarding state keyed to the current user in `localStorage` only after confirmation.

- [ ] **Step 1: Write failing UI behavior tests**

```tsx
it("submits registration and shows the verification instruction", async () => {
  render(<PublicAuthForm mode="register" />);
  await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Senha"), "senha-segura12");
  await userEvent.click(screen.getByRole("button", { name: "Criar conta" }));
  expect(await screen.findByText("Confira seu e-mail para ativar a conta.")).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/auth/public-auth-form.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Build focused pages and redirect behavior**

Use the existing Tailwind green visual language. The registration screen links to `/termos` and `/privacidade`; the sign-in screen uses `signIn("credentials", { redirect: false, email, password })`; the reset pages call the Task 2 endpoints. Dashboard layout redirects an unauthenticated visitor to `/entrar?next=<encoded-path>` and renders `PublicOnboarding` for a newly confirmed user. The landing hero uses `/cadastro` as its primary CTA and `/entrar` as its secondary CTA.

- [ ] **Step 4: Pass the focused test and build**

Run: `npm test -- src/components/auth/public-auth-form.test.tsx && npm run build`

Expected: PASS and Next.js reports a successful production build.

- [ ] **Step 5: Commit the slice**

```bash
git add src/app/cadastro src/app/entrar src/app/verificar-email src/app/recuperar-senha src/app/redefinir-senha src/components/auth src/components/account src/app/dashboard/layout.tsx src/app/page.tsx
git commit -m "feat: add public account onboarding"
```

## Task 4: Make WhatsApp ownership verifiable instead of transferable

**Files:**
- Create: `src/lib/phone-verification.ts`
- Create: `src/lib/phone-verification.test.ts`
- Create: `src/app/api/assistant/whatsapp-phone/route.test.ts`
- Modify: `src/app/api/assistant/whatsapp-phone/route.ts`
- Modify: `src/app/api/webhook/whatsapp/route.ts`
- Modify: `src/components/account/whatsapp-link-card.tsx`

**Interfaces:**
- Consumes `PhoneVerification` from Task 1 and `normalizePhone` from `src/lib/zernio.ts`.
- Produces `startPhoneVerification(userId, phone): Promise<{ code: string; expiresAt: Date }>` and `consumePhoneVerification(phone, code): Promise<{ userId: string } | null>`.
- The panel displays the one-time code; it never calls `replaceExisting` and never displays another account's data.

- [ ] **Step 1: Write failing ownership tests**

```ts
it("does not set User.phone when the number is only typed in the panel", async () => {
  const response = await PUT(authenticatedRequest({ phone: "+5511999999999" }));
  expect(response.status).toBe(202);
  expect(prisma.user.update).not.toHaveBeenCalled();
});

it("links the matching sender after a valid inbound verification message", async () => {
  await seedPhoneChallenge({ userId: "user-a", phone: "+5511999999999", code: "482193" });
  await webhookPOST(signedInbound({ senderPhone: "+5511999999999", text: "VINCULAR 482193" }));
  expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user-a" } }));
});

it("does not steal a number already linked to another account", async () => {
  await seedLinkedPhone({ userId: "user-b", phone: "+5511999999999" });
  await expect(consumePhoneVerification("+5511999999999", "482193")).resolves.toBeNull();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/phone-verification.test.ts src/app/api/assistant/whatsapp-phone/route.test.ts`

Expected: FAIL because the route currently updates the phone and supports transfer.

- [ ] **Step 3: Implement challenge creation and webhook consumption**

Generate six numeric digits with `randomInt(100000, 1000000)`, hash them with SHA-256, expire them after ten minutes, and replace only the current user's unverified challenge. `PUT /api/assistant/whatsapp-phone` returns `202` with `{ phone, code, expiresAt }`, never saves `User.phone`. If another verified user owns the number, return `409` and do not offer replacement.

Before `findUserByPhone` in the signed webhook, parse only `VINCULAR <six digits>` with `/^VINCULAR\\s+(\\d{6})$/i`. Atomically consume its matching challenge and set `User.phone` only when the phone remains unowned. Reply with a confirmation on success; respond with a generic expired/invalid code message otherwise. All other inbound messages retain the existing agent path.

- [ ] **Step 4: Replace the account UI copy and pass tests**

Change the card to present the returned code and this instruction: `Envie “VINCULAR 123456” para o WhatSpent pelo número informado em até 10 minutos.` It must mark a phone as linked only after a fresh `GET` returns the server-stored number. Remove `canReplace`, `replaceExisting`, and all transfer copy.

Run: `npm test -- src/lib/phone-verification.test.ts src/app/api/assistant/whatsapp-phone/route.test.ts src/lib/personal-agent.test.ts`

Expected: PASS, including the existing appointment tests.

- [ ] **Step 5: Commit the slice**

```bash
git add prisma src/lib/phone-verification.ts src/lib/phone-verification.test.ts src/app/api/assistant/whatsapp-phone src/app/api/webhook/whatsapp src/components/account/whatsapp-link-card.tsx
git commit -m "feat: verify WhatsApp ownership before linking"
```

## Task 5: Remove commercial pricing and publish public legal controls

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/dashboard/conta/plano/page.tsx`
- Create: `src/app/termos/page.tsx`
- Create: `src/app/privacidade/page.tsx`
- Create: `src/app/excluir-conta/page.tsx`
- Create: `src/app/api/account/export/route.ts`
- Create: `src/app/api/account/deletion-request/route.ts`
- Create: `src/app/api/account/privacy.test.ts`
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_account_deletion_requests/migration.sql`

**Interfaces:**
- Produces `AccountDeletionRequest` with `userId`, `requestedAt`, `confirmedAt`, `completedAt`, and `status` values `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.
- `GET /api/account/export` returns only the authenticated user's JSON data with `Content-Disposition: attachment`.
- `POST /api/account/deletion-request` creates a pending request only for the authenticated user and sends an acknowledgment to the account e-mail.

- [ ] **Step 1: Write failing privacy tests**

```ts
it("exports only the authenticated user's records", async () => {
  const response = await exportGET(authenticatedAs("user-a"));
  const body = await response.json();
  expect(body.user.id).toBe("user-a");
  expect(body.transactions.every((row: { userId: string }) => row.userId === "user-a")).toBe(true);
});

it("creates a deletion request without deleting data immediately", async () => {
  const response = await deletionPOST(authenticatedAs("user-a"));
  expect(response.status).toBe(202);
  expect(prisma.user.delete).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/app/api/account/privacy.test.ts`

Expected: FAIL because the account routes and deletion model do not exist.

- [ ] **Step 3: Implement free public copy and privacy pages**

Remove the `#precos` navigation item and entire price card in `src/app/page.tsx`; replace it with a free-validation section whose primary button is `/cadastro`. Replace the account plan screen's subscription controls with `Acesso gratuito durante a validação` and no payment button.

Terms and Privacy must link to each other, show last-updated date, identify Lucas Simioni as controller and `suporte@whatspent.com` as contact, describe account, finance, agenda, assistant and WhatsApp processing, explain that Belvo/Open Finance is not enabled, and link to `/excluir-conta`. The deletion page requires login to submit the request and otherwise links to `/entrar?next=/excluir-conta`.

- [ ] **Step 4: Implement scoped export and deletion request**

Use `getCurrentUser()` and Prisma filters that include `userId: user.id` for every direct record. Export only supported user-owned collections: profile fields excluding `passwordHash`, transactions, card purchases/installments, cards, events, projects/tasks, notes, recurring transactions, budgets, goals, preferences, personal agent conversation/messages and the phone status. Do not export OAuth tokens, sessions, rate-limit buckets, webhook signatures or other users' team/chat data.

The deletion endpoint upserts the request, stores no free-text financial data, rate-limits by user ID, and e-mails the acknowledgment. The public policy states the request is verified and completed through `suporte@whatspent.com`; it does not promise instant irreversible deletion.

- [ ] **Step 5: Pass tests, build and commit**

Run: `npm test -- src/app/api/account/privacy.test.ts && npm run build`

Expected: PASS and successful production build.

```bash
git add src/app/page.tsx src/app/dashboard/conta/plano/page.tsx src/app/termos src/app/privacidade src/app/excluir-conta src/app/api/account prisma
git commit -m "feat: add free public privacy controls"
```

## Task 6: Establish a request-bound PostgreSQL context before enabling RLS

**Files:**
- Create: `src/lib/db-context.ts`
- Create: `src/lib/db-context.test.ts`
- Modify: `src/lib/prisma.ts`
- Create: `src/lib/prisma-service.ts`
- Modify: `src/lib/current-user.ts`
- Modify: `src/lib/auth.ts`
- Modify: `src/app/api/dashboard/summary/route.ts`
- Modify: `src/app/api/transactions/route.ts`
- Modify: `src/app/api/financial/cards/route.ts`
- Modify: `src/app/api/events/route.ts`
- Modify: `src/app/api/webhook/whatsapp/route.ts`

**Interfaces:**
- Produces `withUserDb<T>(userId: string, work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>`.
- Produces `servicePrisma`, a server-only Prisma client whose datasource is `DIRECT_URL`, for NextAuth, migrations, rate limiting, signed-webhook idempotency and account token delivery only.
- Each user-scoped route passes the transaction client to services instead of reading the global client inside its data path.

- [ ] **Step 1: Write failing transaction-context tests**

```ts
it("sets only the current user identifier as a transaction-local setting", async () => {
  await withUserDb("user-a", async () => undefined);
  expect(executeRaw).toHaveBeenCalledWith(expect.stringContaining("set_config('app.user_id'"), "user-a");
  expect(executeRaw).toHaveBeenCalledWith(expect.stringContaining("true"));
});

it("uses the privileged client only for the server-side auth adapter", async () => {
  expect(authOptions.adapter).toEqual(expect.anything());
  expect(servicePrisma).not.toBe(appPrisma);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/db-context.test.ts`

Expected: FAIL because no request-bound database context exists.

- [ ] **Step 3: Implement the wrappers and first route conversions**

Implement `withUserDb` as a single `prisma.$transaction`, immediately run:

```ts
await tx.$executeRaw`SELECT set_config('app.user_id', ${userId}, true)`;
```

Do not interpolate SQL identifiers or values. Build `servicePrisma` with `DIRECT_URL` and use it only in server modules; change `PrismaAdapter(prisma)` in `src/lib/auth.ts` to `PrismaAdapter(servicePrisma)`. Keep rate-limit buckets, e-mail/password tokens, NextAuth `Account`/`Session`, and signed-webhook idempotency on `servicePrisma`. Convert the listed user data routes first, changing helpers to accept `Prisma.TransactionClient` where they issue database calls. A signed webhook may use `servicePrisma` to verify/idempotently record the inbound event, but it must switch to `withUserDb(linkedUserId, ...)` before reading or changing a user's assistant, event or financial data. Keep response shapes unchanged.

- [ ] **Step 4: Pass focused context and route tests**

Run: `npm test -- src/lib/db-context.test.ts src/lib/dashboard-expenses.test.ts src/app/api/financial/cards/route.test.ts src/app/api/financial/card-purchases/route.test.ts`

Expected: PASS with no response-shape regression.

- [ ] **Step 5: Commit the groundwork**

```bash
git add src/lib/db-context.ts src/lib/db-context.test.ts src/lib/prisma.ts src/lib/prisma-service.ts src/lib/current-user.ts src/lib/auth.ts src/app/api/dashboard/summary/route.ts src/app/api/transactions/route.ts src/app/api/financial/cards/route.ts src/app/api/events/route.ts src/app/api/webhook/whatsapp/route.ts
git commit -m "feat: add request-bound database context"
```

## Task 7: Roll out RLS with a restricted Neon role and policy tests

**Files:**
- Create: `prisma/migrations/<timestamp>_enable_row_level_security/migration.sql`
- Create: `scripts/verify-rls.mjs`
- Create: `scripts/verify-rls.test.ts`
- Create: `scripts/enable-rls.mjs`
- Modify: `scripts/vercel-build.mjs`
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Reads `DATABASE_URL` as non-owner `whatspent_app` and `DIRECT_URL` as migration/service connection.
- Uses SQL function `app_current_user_id()` reading `current_setting('app.user_id', true)` and function `app_is_team_member(team_id text)` for team membership policies.
- Produces `npm run db:verify-rls`, which proves user A cannot read/write user B data.

- [ ] **Step 1: Write a failing RLS verification test**

```ts
it("rejects user A reading user B transaction through the restricted role", async () => {
  await setUserContext("user-a");
  await expect(queryTransaction("user-b-transaction")).rejects.toThrow(/row-level security|not found/i);
});
```

- [ ] **Step 2: Run it to verify the absence of enforcement**

Run: `npm test -- scripts/verify-rls.test.ts`

Expected: FAIL because the current database role bypasses RLS and no policy exists.

- [ ] **Step 3: Add the migration and runbook**

The migration creates safe helper functions and enables plus forces RLS on every application table except `RateLimitBucket` and `_prisma_migrations`. The service-only tables (`Account`, `Session`, `EmailVerificationToken`, `PasswordResetToken`, `PhoneVerification`, `AccountDeletionRequest`, and `ZernioWebhookEvent`) receive no grants for `whatspent_app`; the service client is their only caller. For direct ownership tables (`User`, `Budget`, `FinancialGoal`, `RecurringTransaction`, `FinancialAlert`, `FinancialPreferences`, `Transaction`, `TransactionRule`, `CreditCard`, `CardPurchase`, `Event`, `Note`, `AssistantConversation`) use policies equivalent to:

```sql
CREATE POLICY user_owned_select ON "Transaction"
  FOR SELECT USING ("userId" = app_current_user_id());
CREATE POLICY user_owned_write ON "Transaction"
  FOR ALL USING ("userId" = app_current_user_id())
  WITH CHECK ("userId" = app_current_user_id());
```

For child tables (`CardInstallment`, `CardStatementPayment`, `Task`, `AssistantMessage`, `AssistantAttachment`, `ChatMessage`, `ChatAttachment`) policy predicates must join to their parent owner or an authorized participant; no child policy grants direct unrestricted access. For team-owned tables (`Team`, `TeamMember`, `Project`, `ChatConversation`, `ChatParticipant`, and optional team finance rows), use `app_is_team_member(team_id text)` and `app_is_team_admin(team_id text)` with `SECURITY DEFINER`, fixed `search_path = pg_catalog, public`, and no dynamic SQL. The membership function prevents policy recursion; the admin function governs invitations and team modifications. Grant execute only to `whatspent_app`. `FamilyCalendarShare` uses both `userId = app_current_user_id()` and team membership. Any user-facing table discovered by the Task 7 inventory must be categorized as direct-owner, child-owner, team-owner or service-only before RLS is enabled.

The Neon operator runbook must instruct Lucas to create a random password outside the repository, then execute, in Neon SQL Console:

```sql
CREATE ROLE whatspent_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS PASSWORD '<generated-secret>';
GRANT CONNECT ON DATABASE neondb TO whatspent_app;
GRANT USAGE ON SCHEMA public TO whatspent_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO whatspent_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO whatspent_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO whatspent_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO whatspent_app;
```

Then set Vercel `DATABASE_URL` to the pooled `whatspent_app` URL and preserve the privileged direct URL only as `DIRECT_URL` for `prisma migrate deploy`. Deploy first with `DATABASE_RLS_ENABLED=false` and run the verifier against a disposable staging dataset. Do not put the generated password in terminal history, docs, tests, commits or Sentry.

- [ ] **Step 4: Convert remaining request paths before flipping the environment flag**

Use `rg -n "prisma\\." src/app src/lib` to enumerate every user-facing route and service. For each operation, use `withUserDb` or deliberately move server-only work to `servicePrisma`. Convert in this order: financial rules/workspaces/monthly-close/invites; projects/tasks/notes; agenda/calendar integration; chats/attachments; assistant conversations/uploads; account export/deletion; then webhook/cron. Add a same-owner and cross-owner test for every converted resource. The Prisma migration creates helper functions and policies but does not execute `ENABLE ROW LEVEL SECURITY`. `scripts/enable-rls.mjs` contains the finite `ALTER TABLE ... ENABLE FORCE ROW LEVEL SECURITY` list and executes it only when `DATABASE_RLS_ENABLED === "true"`; `scripts/vercel-build.mjs` runs that script after `prisma migrate deploy` only in production.

- [ ] **Step 5: Validate restricted-role behavior and commit**

Run: `npm run db:verify-rls && npm test && npm run build`

Expected: verifier proves cross-user select, update, insert and delete fail; all tests and production build pass.

```bash
git add prisma/migrations scripts src .env.example README.md
git commit -m "feat: enforce database row isolation"
```

## Task 8: Release validation and controlled public launch

**Files:**
- Create: `docs/release/2026-08-31-public-launch-checklist.md`
- Create: `docs/release/public-launch-checklist.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes the completed routes, verified Vercel variables, restricted-role verifier and production deployment.
- Produces an auditable go/no-go checklist with named evidence for every public-launch criterion.

- [ ] **Step 1: Write the failing release checklist assertion**

Create a Vitest test that loads the checklist and asserts it contains all required evidence labels: `E-mail confirmado`, `Recuperação de senha`, `WhatsApp verificado`, `Isolamento entre duas contas`, `RLS restrito`, `Sentry`, `Termos`, `Privacidade`, `Exclusão de conta`, `Belvo desativado`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- docs/release/public-launch-checklist.test.ts`

Expected: FAIL because the checklist does not exist.

- [ ] **Step 3: Complete the controlled verification**

Create two disposable test users with different e-mails and WhatsApp numbers. Confirm both e-mails, link each number by sending its own `VINCULAR` code, create a transaction and event in user A, and prove user B's dashboard, API calls and WhatsApp conversation cannot observe them. Trigger a harmless validation failure in Preview to confirm Sentry receives only route metadata. Verify Vercel has `RESEND_API_KEY`, `EMAIL_FROM`, `NEXTAUTH_URL`, `ZERNIO_API_KEY`, `ZERNIO_WEBHOOK_SECRET`, `ZERNIO_WHATSAPP_ACCOUNT_ID`, `SENTRY_DSN`, restricted `DATABASE_URL`, privileged `DIRECT_URL`, and `DATABASE_RLS_ENABLED=true` in the correct environment.

- [ ] **Step 4: Pass the documentation test and final quality gate**

Run: `npm test -- docs/release/public-launch-checklist.test.ts && npm test && npm run lint && npm run build`

Expected: all commands pass and the checklist has recorded evidence or an explicit launch block.

- [ ] **Step 5: Commit and open a reviewable PR**

```bash
git add docs/release/2026-08-31-public-launch-checklist.md docs/release/public-launch-checklist.test.ts README.md
git commit -m "docs: add public launch checklist"
git push -u origin codex/public-launch-foundation
gh pr create --base main --head codex/public-launch-foundation --title "feat: prepare WhatSpent for public launch" --body-file .github/PULL_REQUEST_TEMPLATE.md
```

## Plan self-review

- **Spec coverage:** Tasks 1–3 cover free registration, e-mail confirmation and recovery. Task 4 replaces unsafe phone transfer with proof of possession. Task 5 covers pricing removal, support, terms, privacy, export and deletion request. Tasks 6–7 establish and verify RLS. Task 8 provides the two-account launch gate and documents Belvo's disabled state.
- **Placeholders:** Migration timestamps are Prisma-generated at execution time; no behavioral requirement depends on a literal timestamp. No secret, credential or personal CPF is included.
- **Type consistency:** Task 1 defines the token functions and models used by Tasks 2 and 4. Task 6 defines `withUserDb`/`withServiceDb` before Task 7 uses them. The restricted database role is named `whatspent_app` consistently.
