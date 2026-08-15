# Chat familiar e anexos privados

O chat funciona assim que a migração do Prisma for aplicada. Os anexos exigem uma etapa adicional na Vercel:

1. Abra o projeto WhatSpent na Vercel e vá em **Storage**.
2. Crie um banco **Blob** com acesso **Private**.
3. Confirme que `BLOB_READ_WRITE_TOKEN` foi adicionada aos ambientes Production, Preview e Development.
4. Faça um novo deploy. O comando de build já executa `prisma migrate deploy` antes do Next.js.

Sem essa variável, as mensagens de texto continuam disponíveis e o aplicativo explica que os anexos ainda não foram configurados. Arquivos privados nunca usam uma URL pública: cada download passa por `/api/chat/attachments/[attachmentId]`, que confirma se a pessoa pertence à conversa.

Limites atuais: até 10 anexos por mensagem, 25 MB por arquivo. São aceitos imagens, áudio, vídeo, PDF, OFX, CSV, planilhas e documentos. Executáveis e instaladores são bloqueados.
