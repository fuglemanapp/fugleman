# Agenda familiar e Google Calendar compartilhado

## Objetivo

Permitir que dois membros de uma Família do WhatSpent visualizem os calendários principais um do outro no aplicativo e no Google Calendar, mantendo a autoria e a edição de cada compromisso restritas ao seu criador.

## Escopo

O recurso usa a Família já existente no WhatSpent. Cada pessoa continua tendo uma agenda própria, conectada à sua própria conta Google. Não haverá cópias de eventos nem um terceiro calendário espelho do WhatSpent.

## Consentimento e compartilhamento

1. O administrador cria a Família e convida o membro.
2. Cada membro conecta/reconecta sua conta Google com a permissão de compartilhar o calendário principal.
3. Em Agenda > Compartilhamento familiar, cada membro ativa explicitamente “Compartilhar meu calendário”.
4. Quando ambos estiverem ativos, o WhatSpent adiciona o e-mail do parceiro como leitor do calendário principal no Google Calendar.
5. O Google Calendar de cada membro passa a mostrar os eventos existentes e futuros do outro, sem duplicações.

Cada membro pode revogar o próprio consentimento a qualquer momento. Essa ação remove do Google a permissão de leitura do parceiro, mas nunca remove ou altera eventos existentes.

## Agenda no WhatSpent

### Minha agenda

Mostra apenas os eventos do usuário autenticado. O usuário pode criar, editar e excluir seus próprios eventos, inclusive os sincronizados com seu Google Calendar.

### Agenda familiar

Mostra os eventos dos dois membros, com o nome do dono em cada item. Ações de criar, editar e excluir ficam disponíveis somente nos eventos do usuário autenticado. Eventos do parceiro são renderizados como somente leitura.

O seletor de visualização fica na página de Agenda e persiste na URL: `view=personal` ou `view=family`.

## Modelo de dados

`Event` continua pertencendo a um `userId`; não recebe `teamId`, pois os eventos pessoais não são transferidos para a Família. Um novo registro de preferência de compartilhamento por membro armazena:

- família (`teamId`) e usuário (`userId`);
- se o usuário autorizou o compartilhamento;
- ID do calendário primário Google quando disponível;
- ID da regra de acesso criada no Google para o parceiro;
- data da última sincronização e eventual erro legível.

O par `teamId` + `userId` é único. Somente membros da mesma Família podem ler o estado de compartilhamento; cada membro altera somente o próprio consentimento.

## Integração Google Calendar

O OAuth solicitará a permissão adicional necessária para administrar regras de acesso do calendário. A conexão existente continua responsável por importar e criar eventos no calendário principal de cada usuário.

Ao ativar ou quando o parceiro concluir o consentimento, o servidor:

- obtém/renova o token Google de cada conta;
- cria ou atualiza a regra de leitura para o e-mail do parceiro;
- registra o ID retornado pela API Google;
- devolve um estado claro ao aplicativo.

Ao desativar, o servidor exclui apenas a regra de acesso que ele próprio criou. Falhas transitórias são registradas como aviso e podem ser tentadas novamente, sem remover a intenção do usuário.

## Permissões e segurança

- Membro e administrador podem ativar ou desativar o próprio compartilhamento.
- Ninguém pode ativar o compartilhamento em nome do parceiro.
- Na API de eventos, a leitura familiar exige associação à Família; escrita e exclusão continuam restritas ao `userId` do evento.
- O e-mail do parceiro só é usado para criar a regra Google depois da dupla confirmação.
- A desativação preserva todos os eventos e remove somente a permissão concedida pelo WhatSpent.

## Estados e erros

- **Aguardando você**: o usuário ainda não consentiu ou não reconectou o Google com a nova permissão.
- **Aguardando parceiro**: o usuário autorizou, mas o outro membro ainda não.
- **Ativo**: regras de leitura criadas nos dois calendários.
- **Atenção necessária**: uma conta Google expirou ou recusou a permissão; o usuário recebe o caminho para reconectar.

## Validação

- Testar criação de Família e convite com duas contas.
- Testar ativação unilateral e dupla confirmação.
- Testar visualização de eventos existentes e novos no Google Calendar do parceiro.
- Testar que o parceiro não consegue editar/excluir evento alheio via interface ou API.
- Testar revogação e remoção da regra Google sem apagar eventos.
- Validar lint, tipos, build e a migração Prisma antes do deploy.
