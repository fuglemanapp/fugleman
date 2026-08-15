# App instalável e chat familiar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Tornar o WhatSpent instalável como PWA e fornecer conversas privadas e familiares com anexos seguros entre membros de um mesmo time.

**Architecture:** O PWA usa manifest, service worker pequeno e aviso de instalação no cliente. O chat é persistido no PostgreSQL com Prisma; permissões são derivadas de TeamMember. O navegador consulta novas mensagens a cada oito segundos, e anexos só usam Vercel Blob após autorização autenticada vinculada à conversa.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma/PostgreSQL, NextAuth, Tailwind CSS, Lucide React, Vercel Blob, Vitest.

## Global Constraints

- Preservar os contextos familiares existentes e aceitar somente participantes do mesmo Team.
- Aceitar texto, imagens, áudio, vídeo e documentos de até **25 MB**; recusar executáveis e mensagens vazias.
- Não implementar integração, automação ou espelhamento do WhatsApp.
- Não adicionar conversas públicas, chamadas, reações, edição, exclusão, encaminhamento, push notifications ou criptografia ponta a ponta.
- Não aceitar senderId, lista de participantes, URL de anexo ou userId como autoridade vinda do cliente.
- Sem BLOB_READ_WRITE_TOKEN, texto deve funcionar e anexos devem informar como habilitar o recurso.
- O Blob deve ser criado com acesso Private; anexos são entregues por rota autenticada.
- Manter a aparência premium branca e verde já usada no dashboard.

---

## File Structure

- prisma/schema.prisma: modelos de conversa, participantes, mensagens e anexos.
- prisma/migrations/20260815090000_add_family_chat/migration.sql: tabelas, chaves e índices.
- src/lib/chat.ts: validação de arquivo, autorização e criação idempotente de conversa.
- src/lib/chat.test.ts: testes de regras puras.
- src/app/api/chat/conversations: lista, conversa direta, leitura e mensagens.
- src/app/api/chat/uploads e src/app/api/chat/attachments/[attachmentId]: upload e entrega autenticada do Vercel Blob privado.
- src/app/manifest.ts, public/sw.js e src/components/pwa: PWA.
- src/components/chat/chat-workspace.tsx: interface responsiva, polling e envio.
- src/app/dashboard/conversas/page.tsx e src/components/dashboard/dashboard-nav.tsx: rota e navegação.
- README.md e docs/production-readiness.md: ativação do Blob na Vercel.
- package.json e package-lock.json: @vercel/blob, vitest e script test.

## Task 1: Criar base testável do chat

**Files:**
- Modify: package.json
- Modify: package-lock.json
- Modify: prisma/schema.prisma
- Create: prisma/migrations/20260815090000_add_family_chat/migration.sql
- Create: src/lib/chat.ts
- Create: src/lib/chat.test.ts

**Interfaces:**
- Produces directConversationKey(firstUserId: string, secondUserId: string): string.
- Produces validateChatFile(input): { ok: true } | { ok: false; error: string }.
- Produces models ChatConversation, ChatParticipant, ChatMessage, ChatAttachment.

- [ ] **Step 1: Adicionar dependências e script de teste**

Atualize package.json sem remover scripts existentes:

~~~json
{
  "scripts": { "test": "vitest run" },
  "dependencies": { "@vercel/blob": "^2.3.0" },
  "devDependencies": { "vitest": "^3.0.0" }
}
~~~

Run: npm install

Expected: package-lock.json contém as duas dependências.

- [ ] **Step 2: Escrever testes que falham**

Crie src/lib/chat.test.ts:

~~~ts
import { describe, expect, it } from "vitest";
import { directConversationKey, normalizeChatText, validateChatFile } from "./chat";

describe("chat helpers", () => {
  it("mantém a chave direta idêntica nos dois sentidos", () => {
    expect(directConversationKey("user-b", "user-a")).toBe("user-a:user-b");
  });

  it("normaliza texto e recusa texto vazio", () => {
    expect(normalizeChatText("  oi, família  ")).toBe("oi, família");
    expect(normalizeChatText("   ")).toBeNull();
  });

  it("aceita PDF válido e recusa executável ou arquivo acima do limite", () => {
    expect(validateChatFile({ fileName: "recibo.pdf", contentType: "application/pdf", size: 1024 })).toEqual({ ok: true });
    expect(validateChatFile({ fileName: "programa.exe", contentType: "application/octet-stream", size: 1024 })).toEqual({ ok: false, error: "Este tipo de arquivo não é permitido." });
    expect(validateChatFile({ fileName: "video.mp4", contentType: "video/mp4", size: 25 * 1024 * 1024 + 1 })).toEqual({ ok: false, error: "O arquivo deve ter no máximo 25 MB." });
  });
});
~~~

- [ ] **Step 3: Confirmar a falha inicial**

Run: npm test -- src/lib/chat.test.ts

Expected: FAIL com erro de módulo ./chat inexistente.

- [ ] **Step 4: Criar schema e migração**

Acrescente a User: chatParticipants ChatParticipant[] e sentChatMessages ChatMessage[] com relação ChatMessageSender. Acrescente a Team: chatConversations ChatConversation[].

Use estes modelos:

~~~prisma
model ChatConversation {
  id           String            @id @default(cuid())
  teamId       String
  kind         String
  directKey    String?
  title        String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  team         Team              @relation(fields: [teamId], references: [id], onDelete: Cascade)
  participants ChatParticipant[]
  messages     ChatMessage[]

  @@unique([teamId, kind, directKey])
  @@index([teamId, updatedAt])
}

model ChatParticipant {
  id             String           @id @default(cuid())
  conversationId String
  userId         String
  lastReadAt     DateTime?
  createdAt      DateTime         @default(now())
  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])
  @@index([userId, lastReadAt])
}

model ChatMessage {
  id             String           @id @default(cuid())
  conversationId String
  senderId       String
  text           String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User             @relation("ChatMessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  attachments    ChatAttachment[]

  @@index([conversationId, createdAt])
}

model ChatAttachment {
  id          String       @id @default(cuid())
  messageId   String?
  ownerId     String
  pathname    String       @unique
  fileName    String
  contentType String
  size        Int
  createdAt   DateTime     @default(now())
  message     ChatMessage? @relation(fields: [messageId], references: [id], onDelete: Cascade)
  owner       User         @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@index([messageId])
  @@index([ownerId, createdAt])
}
~~~

Gere migration.sql com tabelas, índices e FKs. ChatAttachment.messageId é opcional para permitir upload confirmado antes do envio. O endpoint de mensagem aceita somente anexos do proprietário atual sem messageId.

- [ ] **Step 5: Implementar funções puras**

Crie src/lib/chat.ts:

~~~ts
const maximumChatFileSize = 25 * 1024 * 1024;
const blockedExtensions = new Set([".apk", ".bat", ".cmd", ".com", ".dmg", ".exe", ".msi", ".sh"]);
const explicitTypes = new Set([
  "application/pdf", "text/plain", "text/csv", "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function directConversationKey(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort((a, b) => a.localeCompare(b)).join(":");
}

export function normalizeChatText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 4000) : null;
}

export function validateChatFile(input: { fileName: string; contentType: string; size: number }) {
  const extension = "." + (input.fileName.split(".").pop()?.toLowerCase() || "");
  if (blockedExtensions.has(extension)) return { ok: false as const, error: "Este tipo de arquivo não é permitido." };
  if (input.size <= 0) return { ok: false as const, error: "O arquivo está vazio." };
  if (input.size > maximumChatFileSize) return { ok: false as const, error: "O arquivo deve ter no máximo 25 MB." };
  const allowed = input.contentType.startsWith("image/") || input.contentType.startsWith("audio/") || input.contentType.startsWith("video/") || explicitTypes.has(input.contentType);
  return allowed ? { ok: true as const } : { ok: false as const, error: "Este formato não é permitido." };
}

export function isBlobConfigured(environment: Record<string, string | undefined> = process.env) {
  return Boolean(environment.BLOB_READ_WRITE_TOKEN);
}
~~~

- [ ] **Step 6: Verificar e criar commit**

Run: npm test -- src/lib/chat.test.ts && npx prisma validate && npx prisma generate

Expected: testes e Prisma terminam com status 0.

~~~bash
git add package.json package-lock.json prisma/schema.prisma prisma/migrations/20260815090000_add_family_chat/migration.sql src/lib/chat.ts src/lib/chat.test.ts
git commit -m "feat: adiciona base do chat familiar"
~~~

## Task 2: Implementar autorização e APIs de conversas

**Files:**
- Modify: src/lib/chat.ts
- Create: src/app/api/chat/conversations/route.ts
- Create: src/app/api/chat/conversations/direct/route.ts
- Create: src/app/api/chat/conversations/[conversationId]/messages/route.ts
- Create: src/app/api/chat/conversations/[conversationId]/read/route.ts

**Interfaces:**
- Consumes getCurrentUser, Prisma e helpers de Task 1.
- Produces ensureFamilyConversation(teamId) e requireChatParticipant(userId, conversationId).

- [ ] **Step 1: Escrever teste do grupo Família**

Adicione a src/lib/chat.test.ts:

~~~ts
import { conversationTitle } from "./chat";

it("nomeia o grupo e a conversa direta", () => {
  expect(conversationTitle("FAMILY", "Família Silva", [])).toBe("Família");
  expect(conversationTitle("DIRECT", null, [{ id: "other", name: "Ana", email: null }])).toBe("Ana");
});
~~~

- [ ] **Step 2: Confirmar a falha**

Run: npm test -- src/lib/chat.test.ts

Expected: FAIL porque conversationTitle não existe.

- [ ] **Step 3: Implementar acesso e conversa idempotente**

No fim de src/lib/chat.ts, importe prisma e implemente:

~~~ts
export async function requireChatParticipant(userId: string, conversationId: string) {
  const participant = await prisma.chatParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
    include: { conversation: { include: { team: { select: { members: { where: { userId }, select: { userId: true } } } } } } },
  });
  return participant?.conversation.team.members.length ? participant : null;
}

export async function ensureFamilyConversation(teamId: string) {
  return prisma.$transaction(async (tx) => {
    const members = await tx.teamMember.findMany({ where: { teamId }, select: { userId: true } });
    if (members.length < 2) return null;
    const conversation = await tx.chatConversation.upsert({
      where: { teamId_kind_directKey: { teamId, kind: "FAMILY", directKey: "family" } },
      create: { teamId, kind: "FAMILY", directKey: "family" },
      update: {},
    });
    await tx.chatParticipant.createMany({ data: members.map(({ userId }) => ({ conversationId: conversation.id, userId })), skipDuplicates: true });
    return conversation;
  });
}
~~~

Implement conversationTitle(kind, teamName, otherParticipants) para devolver Família em grupo e nome, e-mail ou Conversa privada em direto.

- [ ] **Step 4: Implementar rotas**

GET /api/chat/conversations busca teams do usuário, chama ensureFamilyConversation em famílias com dois membros, lista somente ChatParticipant.userId igual ao usuário atual e inclui última mensagem e contador de mensagens de outro autor posteriores a lastReadAt.

POST /api/chat/conversations/direct recebe somente { teamId, userId }, confirma que ambos são membros distintos e usa:

~~~ts
const directKey = directConversationKey(currentUser.id, body.userId);
const conversation = await prisma.chatConversation.upsert({
  where: { teamId_kind_directKey: { teamId: body.teamId, kind: "DIRECT", directKey } },
  create: { teamId: body.teamId, kind: "DIRECT", directKey, participants: { create: [{ userId: currentUser.id }, { userId: body.userId }] } },
  update: {},
});
~~~

GET /messages?cursor= retorna 50 mensagens com sender e attachments em ordem cronológica. POST /messages aceita { text?, attachmentIds? }, usa normalizeChatText, busca anexos com { id: { in: ids }, ownerId: currentUser.id, messageId: null }, recusa divergência de quantidade e cria mensagem, conexões dos anexos e updatedAt da conversa em transação. POST /read atualiza apenas lastReadAt do participante atual.

Use 401 sem sessão e 403 sem participação; nunca exponha se o ID pertence a outro team.

- [ ] **Step 5: Verificar e criar commit**

Run: npm test -- src/lib/chat.test.ts && npx tsc --noEmit && npm run lint

Expected: status 0.

~~~bash
git add src/lib/chat.ts src/lib/chat.test.ts src/app/api/chat/conversations
git commit -m "feat: adiciona APIs seguras de conversas"
~~~

## Task 3: Adicionar uploads controlados pelo Vercel Blob

**Files:**
- Create: src/app/api/chat/uploads/route.ts
- Create: src/app/api/chat/uploads/complete/route.ts
- Create: src/app/api/chat/attachments/[attachmentId]/route.ts
- Modify: .env.example
- Modify: src/lib/chat.test.ts

**Interfaces:**
- Consumes requireChatParticipant, validateChatFile e isBlobConfigured.
- Produces autorização de upload e ChatAttachment sem mensagem associada.

- [ ] **Step 1: Escrever teste de configuração**

Acrescente:

~~~ts
import { isBlobConfigured } from "./chat";

it("identifica configuração de Blob", () => {
  expect(isBlobConfigured({})).toBe(false);
  expect(isBlobConfigured({ BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_example" })).toBe(true);
});
~~~

- [ ] **Step 2: Rodar teste para confirmar comportamento**

Run: npm test -- src/lib/chat.test.ts

Expected: todos os testes passam após Task 1; este teste registra a regra de configuração.

- [ ] **Step 3: Implementar rotas de upload**

POST /api/chat/uploads recebe { conversationId, fileName, contentType, size }; exige participante, chama validateChatFile e retorna 503 com { error: "Anexos ainda não foram configurados. Ative o Vercel Blob na Vercel." } se não houver token.

Com token, use handleUpload de @vercel/blob/client, prefixo chat/{conversationId}/{currentUser.id}/, access: private, addRandomSuffix: true e maximumSizeInBytes: 25 * 1024 * 1024. No callback onUploadCompleted, repita validação de participação e pathname.

POST /api/chat/uploads/complete recebe { conversationId, pathname, fileName, contentType, size }; exige participação, exige prefixo do usuário/conversa e validateChatFile, e cria ChatAttachment com ownerId do usuário atual e messageId nulo. Antes do create, consulte por pathname para tornar reenvios idempotentes. Não persista URL pública.

Em GET /api/chat/attachments/:attachmentId, busque o anexo com message e conversation, valide requireChatParticipant e use get(pathname) de @vercel/blob para devolver o stream com contentType e Content-Disposition seguro. Retorne 404 quando não houver anexo ou quando o usuário não participar, sem indicar qual caso ocorreu.

- [ ] **Step 4: Documentar a variável**

Acrescente a .env.example:

~~~bash
# Criada em Vercel > Storage > Blob. Necessária somente para anexos do chat.
BLOB_READ_WRITE_TOKEN=""
~~~

- [ ] **Step 5: Verificar e criar commit**

Run: npm test -- src/lib/chat.test.ts && npx tsc --noEmit && npm run lint

Expected: status 0 e nenhuma saída de token em erros.

~~~bash
git add src/app/api/chat/uploads .env.example src/lib/chat.test.ts
git commit -m "feat: adiciona anexos seguros ao chat"
~~~

## Task 4: Criar PWA sem cache de dados autenticados

**Files:**
- Create: src/app/manifest.ts
- Create: public/sw.js
- Create: src/components/pwa/pwa-registration.tsx
- Create: src/components/pwa/install-app-prompt.tsx
- Create: src/components/pwa/pwa-registration.test.ts
- Modify: src/app/layout.tsx
- Modify: src/app/globals.css

**Interfaces:**
- Produces /manifest.webmanifest, /sw.js, PwaRegistration e InstallAppPrompt.

- [ ] **Step 1: Escrever teste do worker**

Crie src/components/pwa/pwa-registration.test.ts:

~~~ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("service worker", () => {
  it("não faz cache de APIs autenticadas", () => {
    const worker = readFileSync("public/sw.js", "utf8");
    expect(worker).toContain("request.url.includes('/api/')");
    expect(worker).toContain("return fetch(request)");
  });
});
~~~

- [ ] **Step 2: Confirmar a falha**

Run: npm test -- src/components/pwa/pwa-registration.test.ts

Expected: FAIL pois public/sw.js não existe.

- [ ] **Step 3: Implementar manifest e worker**

Crie src/app/manifest.ts:

~~~ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WhatSpent",
    short_name: "WhatSpent",
    description: "Finanças, agenda e organização familiar.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#087d3c",
    icons: [
      { src: "/iconws-transparent.png", sizes: "192x192", type: "image/png" },
      { src: "/iconws.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [{ name: "Visão geral", url: "/dashboard" }, { name: "Conversas", url: "/dashboard/conversas" }],
  };
}
~~~

Em public/sw.js, use versão de cache e somente faça cache de /, /login, /manifest.webmanifest, fontes e imagens públicas. No fetch handler, antes de qualquer cache:

~~~js
if (request.url.includes('/api/')) return fetch(request);
~~~

Para páginas autenticadas use network-first, retornando somente resposta já existente do cache se a rede estiver indisponível; não chame cache.put para /dashboard ou respostas com header set-cookie.

- [ ] **Step 4: Registrar e oferecer instalação**

PwaRegistration é cliente e registra /sw.js em useEffect se serviceWorker existir em navigator.

InstallAppPrompt guarda beforeinstallprompt, chama prompt() após clique em Instalar app e some se appinstalled ocorrer. Em Safari, detecte userAgent e mostre: “No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.” sem bloquear a tela.

Atualize layout.tsx:

~~~ts
applicationName: "WhatSpent",
manifest: "/manifest.webmanifest",
appleWebApp: { capable: true, statusBarStyle: "default", title: "WhatSpent" },
title: { default: "WhatSpent | Finanças, agenda e organização", template: "%s | WhatSpent" },
description: "Finanças, agenda e organização familiar em um só lugar.",
~~~

Renderize PwaRegistration e o aviso só na área autenticada.

- [ ] **Step 5: Verificar e criar commit**

Run: npm test -- src/components/pwa/pwa-registration.test.ts && npx tsc --noEmit && npm run lint && npm run build

Expected: build passa e expõe manifest.webmanifest.

~~~bash
git add src/app/manifest.ts public/sw.js src/components/pwa src/app/layout.tsx src/app/globals.css
git commit -m "feat: torna o WhatSpent instalavel"
~~~

## Task 5: Construir a experiência de conversas

**Files:**
- Create: src/components/chat/chat-workspace.tsx
- Create: src/app/dashboard/conversas/page.tsx
- Create: src/app/dashboard/conversas/page.test.tsx
- Modify: src/components/dashboard/dashboard-nav.tsx
- Modify: src/app/globals.css

**Interfaces:**
- Consumes APIs de Task 2 e 3.
- Produces rota /dashboard/conversas.

- [ ] **Step 1: Escrever teste da rota**

Crie src/app/dashboard/conversas/page.test.tsx:

~~~tsx
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("conversas page", () => {
  it("exporta uma página", () => {
    expect(Page).toBeTypeOf("function");
  });
});
~~~

- [ ] **Step 2: Confirmar a falha**

Run: npm test -- src/app/dashboard/conversas/page.test.tsx

Expected: FAIL porque a rota não existe.

- [ ] **Step 3: Implementar ChatWorkspace**

Defina:

~~~ts
type Conversation = {
  id: string; kind: "FAMILY" | "DIRECT"; title: string; teamId: string; unreadCount: number;
  lastMessage: { text: string | null; createdAt: string; senderName: string | null } | null;
  participants: { id: string; name: string | null; email: string | null; image: string | null }[];
};
type Message = {
  id: string; text: string | null; createdAt: string;
  sender: { id: string; name: string | null; email: string | null; image: string | null };
  attachments: { id: string; fileName: string; contentType: string; size: number }[];
};
~~~

Use useSearchParams para conversa em ?conversation=<id>. Carregue lista ao montar; carregue mensagens e chame POST /read ao abrir. Com conversa ativa, faça polling de 8.000 ms e atualização em visibilitychange; limpe intervalo/listener ao sair.

No compositor, recuse texto vazio sem arquivo, permita remover arquivo pendente, solicite autorização, envie arquivo, confirme-o, depois envie { text, attachmentIds }. Carregue anexos por /api/chat/attachments/:id para exibir miniatura de imagem, controles nativos de áudio/vídeo e link para PDF/documento. Em resposta 503, mostre orientação para ativar Vercel Blob.

- [ ] **Step 4: Criar rota e menu**

src/app/dashboard/conversas/page.tsx renderiza ChatWorkspace.

Em dashboard-nav.tsx, importe MessageCircle e adicione:

~~~ts
{ label: "Conversas", links: [{ href: "/dashboard/conversas", label: "Mensagens", description: "Fale com sua família" }] }
~~~

Insira antes de Agenda. Desktop usa lista e painel ao lado; mobile mostra lista ou conversa ativa com botão Voltar. Sem família com dois membros, mostre link para /dashboard/conta.

- [ ] **Step 5: Verificar e criar commit**

Run: npm test -- src/lib/chat.test.ts src/components/pwa/pwa-registration.test.ts src/app/dashboard/conversas/page.test.tsx && npx tsc --noEmit && npm run lint && npm run build

Expected: status 0 e a rota compila.

~~~bash
git add src/components/chat src/app/dashboard/conversas src/components/dashboard/dashboard-nav.tsx src/app/globals.css
git commit -m "feat: adiciona interface de conversas familiares"
~~~

## Task 6: Validar produção e documentar anexos

**Files:**
- Modify: README.md
- Modify: docs/production-readiness.md

- [ ] **Step 1: Documentar ativação do Vercel Blob**

Inclua:

~~~text
1. Abra WhatSpent na Vercel.
2. Acesse Storage > Create Database > Blob.
3. Conecte o Blob ao projeto com acesso Private.
4. Verifique BLOB_READ_WRITE_TOKEN em Settings > Environment Variables para Production, Preview e Development.
5. Faça redeploy e envie um PDF menor que 25 MB em /dashboard/conversas.
~~~

Explique que mensagens de texto continuam funcionando sem a variável.

- [ ] **Step 2: Executar validação final**

Run:

~~~bash
npm test
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm run build
~~~

Expected: todos retornam status 0.

- [ ] **Step 3: Fazer deploy e smoke test**

Pelo fluxo Vercel existente, faça deploy de produção. Depois:

~~~bash
curl -I https://whatspent.com/manifest.webmanifest
curl -I https://whatspent.com/sw.js
curl -i https://whatspent.com/api/chat/conversations
~~~

Expected: manifest e worker retornam 200; rota retorna 401 sem sessão. Em conta familiar autenticada, confirme grupo Família, conversa direta, envio de texto, leitura e mensagem de configuração de anexos sem token Blob.

- [ ] **Step 4: Criar commit final**

~~~bash
git add README.md docs/production-readiness.md
git commit -m "docs: orienta ativacao do chat familiar"
~~~

## Plan Self-Review

- Cobertura: Task 1 cria schema, migração, validações e testes; Task 2 implementa grupo, direto e autorização; Task 3 cobre anexos; Task 4 cobre PWA sem cache de dados autenticados; Task 5 cobre interface, menu e responsividade; Task 6 cobre produção.
- Não há placeholders de implementação; funções, rotas, payloads e comandos são definidos no plano.
- Consistência: teamId_kind_directKey, directConversationKey, requireChatParticipant e o fluxo de anexo pendente são usados de forma idêntica em todas as tarefas.
