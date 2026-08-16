# Plano de implementação: agenda familiar no Google Calendar

> **Objetivo:** permitir que dois membros de uma Família vejam as agendas um do outro no WhatSpent e no Google Calendar, mantendo cada evento e sua edição pertencentes ao criador.

## 1. Persistência e OAuth

- Criar `FamilyCalendarShare`, associado a `Team` e `User`, com consentimento, regra ACL criada, último sync e erro.
- Criar a migração Prisma sem alterar migrações já aplicadas.
- Solicitar os escopos de eventos e ACL do Google Calendar no OAuth.
- Preservar conexões antigas para eventos; exigir reconexão apenas para ativar o compartilhamento.

## 2. Serviço de compartilhamento

- Expor funções para verificar permissões, criar/atualizar ACL de leitor e removê-la.
- Sincronizar a agenda individual ao ativar o consentimento.
- Criar uma rotina de reconciliação que só ativa o compartilhamento quando os dois membros consentirem e tiverem Google conectado.
- Remover apenas ACLs ao revogar, nunca eventos.

## 3. APIs

- Criar `GET` e `POST /api/agenda/sharing` para consultar e alterar somente o próprio consentimento.
- Validar que a família tem exatamente dois membros para esta primeira versão.
- Estender `GET /api/events` com `view=family&teamId=...`, exigindo associação à família.
- Adicionar `PATCH /api/events` e manter escrita, edição e remoção limitadas ao dono do evento.

## 4. Interface

- Adicionar um cartão de compartilhamento familiar em Agenda, com estado e caminho para reconectar o Google.
- Persistir a visualização pessoal/familiar na URL.
- Identificar o dono de cada evento na agenda familiar e bloquear ações nos eventos do parceiro.
- Permitir editar compromissos próprios no mesmo formulário usado para criação.

## 5. Verificação e publicação

- Executar geração do Prisma, verificação de tipos, lint e build.
- Aplicar a migração no deploy Vercel e verificar as rotas com resposta autenticada/sem autenticação.
- Documentar a ação necessária: ambos reconectarem suas contas Google e consentirem antes de o Google efetivamente compartilhar os calendários.
