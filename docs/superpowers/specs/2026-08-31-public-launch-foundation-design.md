# Fundação para lançamento público gratuito

## Objetivo

Permitir que qualquer pessoa crie e use gratuitamente uma conta individual do
WhatSpent, incluindo seu próprio painel e agente do WhatsApp, sem permitir
acesso ou vínculo indevido aos dados de outra pessoa.

O lançamento não inclui assinatura, cobrança, anúncios ou armazenamento de
dados bancários via Open Finance. Esses itens ficam fora deste escopo de
validação inicial.

## Experiência de conta

1. A pessoa cria uma conta com nome, e-mail e senha forte.
2. A conta só fica ativa após confirmar o e-mail por um link de uso único e
   prazo curto.
3. A pessoa pode pedir redefinição de senha; a resposta não revela se um e-mail
   possui conta.
4. Depois de entrar, ela vê um onboarding que explica como vincular o WhatsApp,
   registrar gastos e acessar o painel.
5. A landing page não exibe preços nem planos. Ela informa que o produto é
   gratuito durante a fase de validação.

## Vínculo seguro com o WhatsApp

O telefone não será associado apenas por ser digitado no painel. O fluxo será:

1. A pessoa informa seu telefone no painel.
2. O sistema cria um desafio de curta duração para aquele usuário e telefone,
   guardando apenas o hash do código.
3. Ela envia o código para a conta comercial do WhatSpent no WhatsApp.
4. O webhook validado confirma que o código veio daquele mesmo número e conclui
   o vínculo.
5. Só então as mensagens recebidas daquele telefone são encaminhadas ao agente
   daquela conta.

Não haverá opção de substituir o telefone já vinculado a outro usuário. A
troca de número exigirá desvincular o próprio telefone ou atendimento manual.
O agente não inventará horários: pedidos de compromisso sem hora pedem uma
informação complementar.

## Isolamento e segurança de dados

O lançamento usa duas camadas:

- A aplicação continuará exigindo sessão e filtrando sempre por proprietário
  ou membro da equipe autorizada.
- O PostgreSQL receberá RLS com uma função de aplicação sem privilégio de dono,
  contexto de usuário definido dentro de transação e uma função de serviço
  separada para migrações, cron e webhooks.

Ativar RLS antes dessas mudanças quebraria o produto, pois a conexão Prisma
atual atua como dona do banco e ignora as políticas. A migração será gradual,
atrás de uma chave de implantação, e só será ativada depois de testes de duas
contas sem leitura ou escrita cruzada.

## Comunicação, privacidade e suporte

Antes do tráfego público, o site terá páginas acessíveis de Termos de Uso,
Política de Privacidade e Exclusão de Conta. Elas identificarão Lucas Simioni
como controlador, indicarão `suporte@whatspent.com` como contato e explicarão
as finalidades de dados de conta, financeiros, agenda e mensagens.

O produto fornecerá exportação dos dados da própria conta e um fluxo de
exclusão que remove ou anonimiza os dados conforme dependências técnicas e
obrigações legais. Textos jurídicos finais devem passar por revisão jurídica
independente antes do lançamento amplo.

## Operação e validação

- Sentry monitora falhas sem enviar conteúdo financeiro, mensagens, cookies ou
  identificadores pessoais.
- Limites de requisição continuam ativos no app e no Firewall da Vercel.
- O webhook de WhatsApp continua exigindo assinatura e conta configurada.
- O primeiro lançamento será gratuito e observável: cadastro, confirmação,
  vínculo de telefone, criação de evento e separação entre duas contas serão
  testes obrigatórios.

## Critérios de aceite

1. Uma nova pessoa consegue criar, confirmar e recuperar sua conta sem ajuda
   manual.
2. Um telefone só pode ser vinculado ao usuário que provar posse pelo WhatsApp.
3. Dois usuários não conseguem consultar, editar, apagar ou receber mensagens
   referentes aos dados um do outro.
4. O site não mostra valores, planos ou cobrança na landing page.
5. Termos, privacidade, suporte e exclusão de conta são alcançáveis sem login.
6. Testes automatizados e build passam; a implantação de produção aplica as
   migrações com rollback documentado.

## Fora de escopo

- Cobrança, assinaturas e emissão fiscal.
- Integração de Open Finance/Belvo enquanto a produção da Belvo não estiver
  aprovada.
- Atendimento humano 24 horas e garantias de disponibilidade empresarial.
