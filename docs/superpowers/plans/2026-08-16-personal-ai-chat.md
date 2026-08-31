# Personal AI Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace family/direct conversations with a private WhatSpent AI contact that can understand and safely act on each user’s own financial messages.

**Architecture:** Create an assistant-only persistence model keyed by `userId`, separate from `Team` and the existing family-chat tables. A server-only agent service turns natural-language text into a validated action, persists the user message and the assistant response atomically, and renders a WhatsApp-like personal workspace. Private Blob attachments are scoped to the owner’s assistant conversation.

**Tech Stack:** Next.js 15 App Router, React 19, Prisma/PostgreSQL, Vercel Blob, Groq OpenAI-compatible Chat Completions API, Vitest, Tailwind CSS.

## Global Constraints

- Each account has exactly one private WhatSpent assistant conversation; it must not require a `Team` or a Family invite.
- Agent messages and attachments are readable only by the authenticated owner.
- `GROQ_API_KEY` is server-only; never expose it in client code or responses.
- Persist an `EXPENSE`, `INCOME`, or `EVENT` only after strict server-side validation; use `NONE` otherwise.
- Keep the 25 MB maximum per attachment and reject executable extensions.
- Accept image, audio, video and supported document MIME types; audio upload is supported now, automated transcription is deferred until a transcription provider is configured.
- Use Portuguese UI and responses.

---

## File structure

- Modify: `prisma/schema.prisma` — add isolated assistant conversation, message and attachment models and User relation.
- Create: `prisma/migrations/<timestamp>_add_personal_assistant_chat/migration.sql` — database migration for the three assistant tables.
- Create: `src/lib/personal-agent.ts` — action types, Groq request, validation and persistence helpers.
- Create: `src/lib/personal-agent.test.ts` — unit coverage for parsing and action validation.
- Create: `src/app/api/assistant/conversation/route.ts` — authenticated conversation retrieval and creation.
- Create: `src/app/api/assistant/messages/route.ts` — send text/attachments, invoke agent and return both messages.
- Create: `src/app/api/assistant/uploads/route.ts` — authenticated Vercel Blob token generation scoped to the assistant conversation.
- Create: `src/app/api/assistant/uploads/complete/route.ts` — validate uploaded Blob metadata and create pending attachment rows.
- Create: `src/app/api/assistant/attachments/[attachmentId]/route.ts` — private attachment streaming for its owner only.
- Modify: `src/components/chat/chat-workspace.tsx` — replace Family UI with a single WhatSpent thread, attachment picker and audio recorder.
- Modify: `src/app/dashboard/conversas/page.tsx` — render the personal assistant workspace only.
- Modify: `.env.example` — document `GROQ_API_KEY` and optional `GROQ_MODEL` without real values.

### Task 1: Persist one assistant conversation per user

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_personal_assistant_chat/migration.sql`

**Interfaces:**
- Produces `AssistantConversation`, `AssistantMessage`, and `AssistantAttachment` Prisma delegates.
- Produces `User.assistantConversation` for owner-only lookups.

- [ ] **Step 1: Add the failing schema validation expectation**

Run:

```bash
npx prisma validate
```

Expected: the current schema validates but does not contain an assistant conversation model; the following implementation adds the missing types.

- [ ] **Step 2: Add isolated models to `prisma/schema.prisma`**

Add this field to `model User`:

```prisma
assistantConversation AssistantConversation?
```

Add these models after `ChatAttachment`:

```prisma
model AssistantConversation {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user        User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    AssistantMessage[]
  attachments AssistantAttachment[]
}

model AssistantMessage {
  id             String   @id @default(cuid())
  conversationId String
  role           String
  text           String?
  action         Json?
  createdAt      DateTime @default(now())

  conversation AssistantConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  attachments  AssistantAttachment[]

  @@index([conversationId, createdAt])
}

model AssistantAttachment {
  id             String   @id @default(cuid())
  conversationId String
  messageId      String?
  pathname       String   @unique
  fileName       String
  contentType    String
  size           Int
  createdAt      DateTime @default(now())

  conversation AssistantConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  message      AssistantMessage?     @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@index([conversationId, createdAt])
  @@index([messageId])
}
```

- [ ] **Step 3: Create the SQL migration**

Generate the migration using the repository schema:

```bash
npx prisma migrate dev --name add_personal_assistant_chat
```

Verify the generated migration creates `AssistantConversation`, `AssistantMessage`, and `AssistantAttachment`, all foreign keys cascade on user/conversation deletion, and the unique index is on `AssistantConversation.userId`.

- [ ] **Step 4: Validate schema and generated client**

Run:

```bash
npx prisma validate && npx prisma generate
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit the persistence layer**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add personal assistant chat storage"
```

### Task 2: Implement safe agent actions

**Files:**
- Create: `src/lib/personal-agent.ts`
- Create: `src/lib/personal-agent.test.ts`

**Interfaces:**
- Consumes: `User.id`, message text and the generated Prisma models from Task 1.
- Produces `parseAgentAction(value: unknown): AgentAction` and `runPersonalAgent(input: AgentInput): Promise<AgentResult>`.
- `AgentAction` is `{ kind: "EXPENSE" | "INCOME"; amount: number; description: string; category: string; date: string } | { kind: "EVENT"; title: string; startTime: string; endTime: string; description: string | null } | { kind: "NONE" }`.

- [ ] **Step 1: Write failing unit tests**

Create `src/lib/personal-agent.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseAgentAction } from "./personal-agent";

describe("parseAgentAction", () => {
  it("accepts a valid expense action", () => {
    expect(parseAgentAction({ kind: "EXPENSE", amount: 42.5, description: "iFood", category: "Alimentação", date: "2026-08-16" })).toMatchObject({ kind: "EXPENSE", amount: 42.5 });
  });

  it("turns malformed actions into NONE", () => {
    expect(parseAgentAction({ kind: "EXPENSE", amount: -4, description: "", category: "", date: "tomorrow" })).toEqual({ kind: "NONE" });
  });

  it("accepts an event only when it has ordered ISO timestamps", () => {
    expect(parseAgentAction({ kind: "EVENT", title: "Consulta", startTime: "2026-08-17T15:00:00.000Z", endTime: "2026-08-17T16:00:00.000Z", description: null })).toMatchObject({ kind: "EVENT" });
  });
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
npx vitest run src/lib/personal-agent.test.ts
```

Expected: FAIL because `./personal-agent` does not exist.

- [ ] **Step 3: Implement strict parsing and Groq call**

Implement `src/lib/personal-agent.ts` with these public types and guards:

```ts
export type AgentAction =
  | { kind: "EXPENSE" | "INCOME"; amount: number; description: string; category: string; date: string }
  | { kind: "EVENT"; title: string; startTime: string; endTime: string; description: string | null }
  | { kind: "NONE" };

export function parseAgentAction(value: unknown): AgentAction {
  if (!value || typeof value !== "object") return { kind: "NONE" };
  const candidate = value as Record<string, unknown>;
  if (candidate.kind === "EXPENSE" || candidate.kind === "INCOME") {
    const amount = typeof candidate.amount === "number" ? candidate.amount : Number(candidate.amount);
    const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
    const category = typeof candidate.category === "string" ? candidate.category.trim() : "";
    const date = typeof candidate.date === "string" ? candidate.date : "";
    if (Number.isFinite(amount) && amount > 0 && amount <= 1_000_000_000 && description.length <= 140 && category.length <= 80 && /^\\d{4}-\\d{2}-\\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T12:00:00Z`).getTime())) {
      return { kind: candidate.kind, amount, description, category, date };
    }
  }
  if (candidate.kind === "EVENT") {
    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const startTime = typeof candidate.startTime === "string" ? new Date(candidate.startTime) : null;
    const endTime = typeof candidate.endTime === "string" ? new Date(candidate.endTime) : null;
    const description = typeof candidate.description === "string" ? candidate.description.trim() || null : null;
    if (title && title.length <= 120 && startTime && endTime && !Number.isNaN(startTime.getTime()) && !Number.isNaN(endTime.getTime()) && endTime > startTime) {
      return { kind: "EVENT", title, startTime: startTime.toISOString(), endTime: endTime.toISOString(), description };
    }
  }
  return { kind: "NONE" };
}

export async function runPersonalAgent(input: { userId: string; text: string; now: Date }): Promise<{ reply: string; action: AgentAction }> {
  if (!process.env.GROQ_API_KEY) {
    return { reply: "Para eu entender mensagens naturalmente, configure a GROQ_API_KEY no servidor. Nenhum lançamento foi criado.", action: { kind: "NONE" } };
  }
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", response_format: { type: "json_object" }, messages: [{ role: "system", content: "Responda JSON com reply e action. action.kind é EXPENSE, INCOME, EVENT ou NONE. Não confirme ações que não estejam completas." }, { role: "user", content: input.text }] }) });
  const payload = await response.json() as { choices?: { message?: { content?: string } }[] };
  const content = payload.choices?.[0]?.message?.content || "{}";
  const result = JSON.parse(content) as { reply?: unknown; action?: unknown };
  return { reply: typeof result.reply === "string" && result.reply.trim() ? result.reply.trim() : "Não consegui interpretar isso com segurança.", action: parseAgentAction(result.action) };
}
```

`parseAgentAction` must reject values above `1_000_000_000`, blank text fields, non-ISO dates, and end times less than or equal to start times. `runPersonalAgent` must return `{ kind: "NONE" }` and a setup message if `GROQ_API_KEY` is absent. The prompt must demand JSON `{ reply, action }`, explain that the agent is a Brazilian personal finance assistant, and forbid fabricating confirmations.

- [ ] **Step 4: Persist only validated actions**

In `runPersonalAgent`, after `parseAgentAction` succeeds:

```ts
if (action.kind === "EXPENSE" || action.kind === "INCOME") {
  await prisma.transaction.create({ data: { userId, amount: action.amount, description: action.description, category: action.category, type: action.kind, date: new Date(action.date), source: "ASSISTANT" } });
}

if (action.kind === "EVENT") {
  await prisma.event.create({ data: { userId, title: action.title, description: action.description, startTime: new Date(action.startTime), endTime: new Date(action.endTime) } });
}
```

For `EVENT`, use `createGoogleCalendarEvent` after the database write and append a warning to the reply when calendar synchronization is unavailable.

- [ ] **Step 5: Run the tests**

Run:

```bash
npx vitest run src/lib/personal-agent.test.ts src/lib/chat.test.ts
```

Expected: all tests pass.

- [ ] **Step 6: Commit the agent service**

```bash
git add src/lib/personal-agent.ts src/lib/personal-agent.test.ts
git commit -m "feat: add personal finance agent"
```

### Task 3: Expose owner-scoped assistant APIs and attachments

**Files:**
- Create: `src/app/api/assistant/conversation/route.ts`
- Create: `src/app/api/assistant/messages/route.ts`
- Create: `src/app/api/assistant/uploads/route.ts`
- Create: `src/app/api/assistant/uploads/complete/route.ts`
- Create: `src/app/api/assistant/attachments/[attachmentId]/route.ts`

**Interfaces:**
- Consumes `getCurrentUser`, `runPersonalAgent`, `AssistantConversation`, `AssistantAttachment`, `BLOB_READ_WRITE_TOKEN`.
- Produces `GET /api/assistant/conversation`, `POST /api/assistant/messages`, private upload endpoints and attachment streaming.

- [ ] **Step 1: Add conversation GET endpoint**

`GET /api/assistant/conversation` must authenticate, then execute:

```ts
const conversation = await prisma.assistantConversation.upsert({
  where: { userId: user.id },
  create: { userId: user.id },
  update: {},
  include: { messages: { orderBy: { createdAt: "asc" }, take: 100, include: { attachments: true } } },
});
return NextResponse.json({ conversation });
```

Return 401 when no current user exists.

- [ ] **Step 2: Add message POST endpoint**

`POST /api/assistant/messages` accepts `{ text?: unknown, attachmentIds?: unknown }`, uses the existing `normalizeChatText`, rejects more than ten attachment IDs, and confirms every attachment belongs to the authenticated user’s `AssistantConversation` and has no `messageId`. Then atomically create the USER message and connect those attachments. Call `runPersonalAgent` only when text is present; create an ASSISTANT message using its reply and serialized action. For attachment-only messages, create an ASSISTANT response stating that files are private and audio must be typed until transcription is enabled.

- [ ] **Step 3: Add owner-only Blob upload endpoints**

The token endpoint must request a pathname beginning with `assistant/${conversation.id}/`, set `access: "private"`, use `CHAT_MAX_FILE_SIZE`, and keep the same `allowedContentTypes` as the current chat uploader. The completion endpoint must call `head(pathname)`, pass metadata to `validateChatFile`, and create:

```ts
await prisma.assistantAttachment.create({
  data: { conversationId: conversation.id, pathname, fileName, contentType: blob.contentType, size: blob.size },
});
```

The stream endpoint must query with `where: { id: attachmentId, conversation: { userId: user.id } }`, use `get(pathname, { access: "private" })`, and return `Cache-Control: private, no-store`.

- [ ] **Step 4: Verify API type safety and behavior**

Run:

```bash
npm run build
```

Expected: API routes compile and no attachment route permits a different user’s file.

- [ ] **Step 5: Commit APIs**

```bash
git add src/app/api/assistant
git commit -m "feat: add private assistant chat APIs"
```

### Task 4: Replace the dashboard UI with the WhatSpent contact

**Files:**
- Modify: `src/components/chat/chat-workspace.tsx`
- Modify: `src/app/dashboard/conversas/page.tsx`

**Interfaces:**
- Consumes the endpoints from Task 3.
- Produces a personal WhatsApp-like assistant UI that works without a Family.

- [ ] **Step 1: Replace family state with assistant state**

Remove all use of `/api/chat/conversations`, Family creation, invite state, people state, and direct-chat actions. Load `GET /api/assistant/conversation` on mount and poll that same endpoint every eight seconds when the document is visible.

- [ ] **Step 2: Render the fixed assistant contact**

Use a single top bar:

```tsx
<header className="border-b border-[#e4eee7] px-5 py-4">
  <p className="font-bold">WhatSpent</p>
  <p className="text-xs text-[#789083]">Seu assistente financeiro pessoal</p>
</header>
```

Show an initial assistant bubble when there are no messages: “Oi! Posso registrar gastos, receitas e compromissos. Ex.: ‘gastei R$ 42 no iFood’.” Render USER messages aligned right and ASSISTANT messages aligned left; do not render other users.

- [ ] **Step 3: Add attachment and browser audio controls**

Keep the file picker and upload flow, but use `assistant/${conversation.id}/${file.name}` and `/api/assistant/uploads`. Add a `MediaRecorder` button only when `navigator.mediaDevices?.getUserMedia` and `window.MediaRecorder` exist. On stop, append `new File([blob], `audio-${Date.now()}.webm`, { type: blob.type || "audio/webm" })` to pending files. Show recording state and let the user remove pending files before sending.

- [ ] **Step 4: Send messages through the assistant endpoint**

Submit:

```ts
await fetch("/api/assistant/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text, attachmentIds }),
});
```

Disable the send button while upload/response is active. Reload the conversation after success and preserve a visible Portuguese error after failure.

- [ ] **Step 5: Verify the page compiles and is accessible**

Run:

```bash
npm run lint && npm run build
```

Expected: both commands exit 0; `/dashboard/conversas` includes no “Família”, “convite”, or member-chat UI.

- [ ] **Step 6: Commit the UI**

```bash
git add src/components/chat/chat-workspace.tsx src/app/dashboard/conversas/page.tsx
git commit -m "feat: replace family chat with personal assistant"
```

### Task 5: Configuration, regression tests and release verification

**Files:**
- Modify: `.env.example`
- Modify: `README.md` if it contains deployment environment-variable instructions.
- Test: `src/lib/personal-agent.test.ts`

**Interfaces:**
- Documents `GROQ_API_KEY`, optional `GROQ_MODEL`, and the existing `BLOB_READ_WRITE_TOKEN`.

- [ ] **Step 1: Document required variables**

Add to `.env.example`:

```dotenv
# Server-only key for the WhatSpent personal assistant.
GROQ_API_KEY=
# Optional Groq chat model override. Leave empty to use the app default.
GROQ_MODEL=
# Created by the Vercel Blob integration; required for private attachments.
BLOB_READ_WRITE_TOKEN=
```

- [ ] **Step 2: Run complete automated verification**

Run:

```bash
npx prisma validate
npm test
npm run lint
npm run build
```

Expected: all commands exit 0. The only permitted build message is the existing multiple-lockfile workspace-root warning.

- [ ] **Step 3: Manually verify the deployed behavior after release**

1. Sign in without a Family and open `/dashboard/conversas`.
2. Send “Gastei R$ 42 no iFood”; verify one expense owned by the signed-in user appears in financial transactions and the assistant confirms it.
3. Send an image and a PDF; verify they open only while signed in as the uploader.
4. Record or attach audio; verify it uploads and the assistant asks for text when no transcription provider is configured.
5. Sign in as a second account; verify it has an independent empty assistant conversation and cannot open the first account’s attachment URL.

- [ ] **Step 4: Commit configuration and final verification**

```bash
git add .env.example README.md src/lib/personal-agent.test.ts
git commit -m "docs: configure personal assistant"
```

## Plan self-review

- **Spec coverage:** Task 1 implements private per-user storage; Task 2 covers Groq and validated actions; Task 3 covers secure API and attachments; Task 4 replaces the wrong UI and adds image/file/audio interaction; Task 5 documents configuration and verifies isolation.
- **No placeholders:** Every task names concrete files, endpoints, commands, models and expected outcomes. The migration timestamp is generated by Prisma rather than manually invented.
- **Type consistency:** `AssistantConversation` is uniquely keyed by `userId`; upload paths use its `id`; message routes use `AssistantAttachment`; action values remain `EXPENSE`, `INCOME`, `EVENT` or `NONE` across API, service and UI.
