# WhatSpent: agente pessoal no chat

## Objetivo

Substituir a tela de conversas entre membros por um único contato pessoal, **WhatSpent**, que funciona como um assistente financeiro conversacional. Cada pessoa usa o próprio agente; o contexto familiar continua sendo usado apenas para visualização agregada de dados.

## Experiência

- A página `/dashboard/conversas` sempre mostra a conversa **WhatSpent** para a pessoa autenticada, inclusive antes de criar uma Família.
- O usuário pode enviar texto, arquivos, imagens e áudios. Cada anexo é privado e vinculado ao usuário.
- Mensagens em linguagem natural podem registrar receita/despesa, responder a perguntas sobre o mês e criar compromissos.
- O agente confirma a ação na resposta e não registra dados quando não conseguir interpretar com segurança.
- Enquanto a integração de IA não estiver configurada, o chat permanece utilizável e explica como habilitá-la, sem fingir que executou uma ação.

## Dados e segurança

- As mensagens do agente pertencem somente ao respectivo usuário; elas não são compartilhadas com membros da Família.
- Anexos usam Vercel Blob com acesso privado, visualizados somente por uma rota autenticada que valide o dono da conversa.
- O servidor limita arquivos a 25 MB e aceita tipos de imagem, áudio e documento conhecidos.
- A conversa de IA não cria nem depende de uma `Team` ou convite.

## IA e automações

- A rota de mensagens chama a API compatível com OpenAI da Groq usando `GROQ_API_KEY` configurada somente no servidor.
- O modelo recebe uma instrução para responder em português e devolver uma ação estruturada opcional: `EXPENSE`, `INCOME`, `EVENT` ou `NONE`.
- O servidor valida valores, datas e campos retornados antes de persistir uma transação ou evento.
- Para áudio, o arquivo é aceito agora; a transcrição automática é ativada quando houver uma capacidade de transcrição configurada. Até lá, o agente pede uma mensagem de texto em vez de inferir conteúdo do áudio.

## Interface

- Cabeçalho: avatar, nome WhatSpent e status “assistente pessoal”.
- Área de mensagens em estilo WhatsApp, com bolhas do usuário e do agente.
- Composer com campo de texto, seletor de anexos, ação de gravar/enviar áudio quando suportado pelo navegador e lista de arquivos anexados antes do envio.
- Mensagem inicial explica exemplos de uso sem bloquear a pessoa com onboarding obrigatório.

## Fora de escopo

- Não há conversa direta entre membros nem grupo familiar dentro desse módulo.
- Não há interpretação confiável de áudio sem o provedor de transcrição configurado.
- Não há acesso de um usuário às mensagens privadas de outro usuário.

## Verificação

- Testes unitários para o parser/validador de ações do agente.
- Build de produção e testes existentes passam.
- Teste manual: enviar texto, imagem/arquivo e áudio; garantir que a tela continue funcional sem uma Família.
