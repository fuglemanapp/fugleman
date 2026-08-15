# WhatSpent — App instalável e chat familiar

**Data:** 2026-08-15  
**Status:** aprovado para especificação

## Objetivo

Fazer do WhatSpent um aplicativo web instalável no celular e no computador e oferecer um chat privado interno enquanto a integração oficial com o WhatsApp não está disponível. O chat deve servir aos membros de uma mesma família do WhatSpent, sem expor mensagens ou anexos a terceiros.

## Decisões confirmadas

1. A entrega será um PWA: continua acessível no navegador e pode ser instalado como aplicativo.
2. Cada família terá um canal compartilhado chamado **Família**.
3. Também haverá conversas privadas diretas entre dois membros da mesma família.
4. Mensagens aceitam texto, fotos, áudios, vídeos, comprovantes e documentos.
5. A primeira versão aceitará arquivos de até 25 MB.
6. O chat é um recurso próprio do WhatSpent, não tenta imitar ou conectar-se indevidamente à rede do WhatsApp.

## Alternativas consideradas

### A. PWA + chat interno com atualização periódica — escolhida

Usa Next.js, PostgreSQL e Vercel Blob. A tela atualiza ao abrir, voltar ao foco e a cada poucos segundos. É adequada à família pequena, não exige outro serviço pago de tempo real e mantém os dados no mesmo produto.

### B. Serviço externo em tempo real

Ably, Pusher, Supabase Realtime ou equivalente oferecem mensagens instantâneas, presença e indicador de digitação. Exigem conta, integração e custo adicional; ficam fora deste estágio.

### C. Mensageiro externo

Não cria custo técnico, mas deixa as conversas fora do WhatSpent e não permite compartilhar gastos, agenda ou arquivos no contexto da família.

## Escopo

### 1. Aplicativo instalável

- Criar manifest com nome, descrição, tema, ícones existentes do WhatSpent e atalhos para Dashboard e Conversas.
- Adicionar service worker próprio para cache do shell público e da página de conversas já visitada; requisições autenticadas continuam usando a rede para não exibir dados financeiros desatualizados.
- A interface mostrará uma instrução discreta de instalação quando o navegador permitir. Safari terá orientação de “Adicionar à Tela de Início”.
- O aplicativo poderá abrir em modo independente, com cor de tema e tela de abertura coerentes com a identidade atual.
- Push notifications ficam fora desta etapa. O app mostrará contadores de não lidas; notificações push podem ser adicionadas depois, quando houver chaves VAPID e decisão sobre alertas.

### 2. Conversas

Nova rota: `/dashboard/conversas`.

- Cada `Team` familiar tem uma conversa de grupo fixa, criada sob demanda, chamada **Família**.
- Um membro pode iniciar uma conversa direta com outro membro do mesmo `Team`.
- Não há busca pública, convite por chat nem conversa com usuários fora da família.
- A lista exibe nome, última mensagem, horário e contador de não lidas.
- A área de conversa exibe mensagens em ordem cronológica, autor, horário, conteúdo e anexos. As mensagens do usuário atual ficam alinhadas à direita.
- Envio de texto e anexos no mesmo compositor. Arquivos são enviados primeiro e a mensagem só é criada depois que os anexos retornarem sucesso.
- A tela recarrega as mensagens a cada 8 segundos e quando volta ao foco; após enviar, atualiza imediatamente. Não haverá promessa de entrega em tempo real nesta fase.
- Cada participante marca as mensagens como lidas ao abrir a conversa. Não haverá indicador de “digitando”, reações, chamada de voz/vídeo ou edição/apagamento de mensagens nesta versão.

### 3. Anexos

- Um armazenamento privado do Vercel Blob guarda o arquivo; o banco persiste apenas metadados e pathname interno.
- Tipos aceitos: imagens, áudio, vídeo, PDF, planilhas, texto e formatos comuns de documentos. O servidor valida tipo declarado, tamanho máximo e vínculo do remetente com a conversa.
- O envio usa URL assinada gerada para usuário autenticado. A aplicação não aceitará uma URL arbitrária enviada pelo navegador.
- O download acontece por rota do WhatSpent, que valida a participação na conversa e lê o blob privado no servidor. O navegador não recebe uma URL pública ou token do armazenamento.
- Para ativar em produção, será necessário criar um armazenamento privado Vercel Blob e cadastrar `BLOB_READ_WRITE_TOKEN` nos ambientes da Vercel. Sem essa variável, o chat continua permitindo texto e mostra orientação clara ao tentar anexar.

## Modelo de dados

### `ChatConversation`

```text
id, teamId, kind, directKey?, title?, createdAt, updatedAt
```

- `kind`: `FAMILY` ou `DIRECT`.
- `FAMILY`: uma única conversa por família.
- `DIRECT`: `directKey` é a combinação ordenada dos dois IDs de usuários, evitando duplicidade entre A→B e B→A.

### `ChatParticipant`

```text
id, conversationId, userId, lastReadAt, createdAt
```

Restrição única: `conversationId, userId`.

### `ChatMessage`

```text
id, conversationId, senderId, text?, createdAt, updatedAt
```

Uma mensagem deve possuir texto ou pelo menos um anexo. Nesta etapa não há edição, exclusão ou encaminhamento.

### `ChatAttachment`

```text
id, messageId, pathname, fileName, contentType, size, createdAt
```

Índice por `messageId`.

## API e autorização

Todas as rotas exigem sessão válida e nunca aceitam IDs de remetente fornecidos pelo cliente.

- `GET /api/chat/conversations`: lista conversas do usuário, cria/retorna o grupo familiar quando necessário e inclui a contagem de não lidas.
- `POST /api/chat/conversations/direct`: cria ou retorna conversa direta. Valida que os dois usuários compartilham o mesmo `Team`.
- `GET /api/chat/conversations/:id/messages?cursor=`: pagina mensagens e anexos. Só funciona para participantes.
- `POST /api/chat/conversations/:id/messages`: envia texto e/ou anexos previamente autorizados. Só funciona para participantes.
- `POST /api/chat/conversations/:id/read`: avança `lastReadAt` do participante atual.
- `POST /api/chat/uploads`: gera autorização para upload privado no Vercel Blob após validar conversa, tamanho e tipo de arquivo.
- `GET /api/chat/attachments/:id`: confirma a participação na conversa e entrega o arquivo privado sem expor credenciais de armazenamento.

O grupo Família terá todos os membros do time como participantes. Conversas diretas terão exatamente dois participantes. Ao remover um membro da família no futuro, suas permissões de chat deverão ser revogadas; como a remoção de membros ainda não existe, esta versão já centraliza a checagem de acesso no vínculo `TeamMember`.

## Interface e navegação

- Incluir **Conversas** como área principal no menu do dashboard, com ícone de mensagem e badge de não lidas.
- Layout responsivo: lista de conversas e área ativa lado a lado em telas grandes; lista e conversa em telas pequenas.
- Estados vazios explicam que o chat passa a existir quando uma Família tem pelo menos dois membros.
- A conversa Família mostra os dois membros pelo nome. A conversa direta mostra o nome e avatar da outra pessoa.
- Um botão “Nova conversa” aparece somente quando há outro membro elegível.
- Links para registrar transação e abrir agenda poderão ser incluídos como atalhos de composição depois que o chat básico estiver estável; a primeira entrega não interpreta mensagens como comandos financeiros.

## Segurança e privacidade

- Apenas membros autenticados do mesmo time podem listar, ler, enviar ou anexar conteúdos.
- O banco registra o autor e o horário de cada mensagem; não há anonimização entre membros participantes.
- Não serão armazenados tokens de serviços de mensagem externos.
- O texto e os metadados ficam no PostgreSQL; anexos são guardados fora do banco no Vercel Blob.
- Limites de tamanho e tipo reduzem abuso, mas não substituem antivírus. Arquivos executáveis não serão aceitos.

## Fluxos principais

### Abrir a conversa Família

1. Usuário abre Conversas.
2. Sistema verifica os times aos quais ele pertence.
3. Para cada família elegível, cria ou encontra o canal Família e inclui os membros como participantes.
4. Interface mostra as conversas disponíveis e o usuário pode abrir o grupo.

### Iniciar conversa privada

1. Usuário clica em Nova conversa.
2. Escolhe um membro da mesma família.
3. Sistema calcula a chave ordenada do par e cria ou retorna a conversa correspondente.
4. Os dois participantes passam a ver a mesma conversa privada.

### Enviar comprovante

1. Usuário escolhe um arquivo de até 25 MB.
2. Sistema solicita ao servidor uma autorização de upload para aquela conversa.
3. Navegador envia o arquivo ao Vercel Blob.
4. Usuário envia a mensagem; a API persiste texto, anexo e autor em uma única transação.
5. Participantes veem a mensagem na próxima atualização ou imediatamente após o próprio envio.

## Fora de escopo

- Integração, automação ou espelhamento de conversas do WhatsApp.
- Chamadas de voz ou vídeo.
- Push notifications nativas.
- Reações, respostas encadeadas, edição, exclusão e encaminhamento.
- Criptografia ponta a ponta.
- OCR ou lançamento financeiro automático baseado em comprovantes.
- Conversas com pessoas que não pertencem à mesma família.

## Critérios de aceite

1. O WhatSpent pode ser instalado como app no navegador compatível e abre com identidade visual correta.
2. Dois membros da mesma família enxergam o grupo Família e conseguem trocar mensagens de texto.
3. Cada membro consegue iniciar e acessar uma única conversa direta com o outro membro.
4. Usuário sem sessão recebe 401; usuário fora da família recebe 403 ou 404 sem vazar conteúdo.
5. Mensagem sem texto e sem anexo é recusada; arquivo acima de 25 MB ou executável é recusado.
6. Um anexo só pode ser vinculado à conversa para a qual foi autorizado e só pode ser baixado por participante dela.
7. Contadores de não lidas diminuem ao abrir a conversa correspondente.
8. Chat com texto continua utilizável sem Vercel Blob; anexos exibem orientação de configuração nesse caso.
9. Migração Prisma, TypeScript, lint e build passam antes do deploy.
