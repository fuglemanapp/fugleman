# WhatSpent — Automação financeira, cartões e fechamento mensal

**Data:** 2026-08-12  
**Status:** aguardando revisão do usuário

## Objetivo

Completar o controle financeiro sem depender de Open Finance: reduzir o trabalho manual de categorizar extratos, controlar cartões e compras parceladas e entregar um fechamento mensal prático. Todas as funcionalidades devem funcionar nos três contextos existentes:

- **Meu financeiro:** dados particulares do usuário atual.
- **Financeiro da parceira:** dados particulares dela, acessados somente pela própria conta.
- **Financeiro familiar:** visão conjunta em que ambos os membros visualizam lançamentos, cartões, projeções e fechamento.

No contexto familiar, os lançamentos continuam pertencendo a quem os criou. Não haverá rateio individual nesta fase.

## Decisões confirmadas

1. Compras no crédito entram como despesa na **data da compra**.
2. A fatura organiza a obrigação de pagamento e seu status; pagar a fatura não cria nova despesa.
3. Cada cartão é pessoal, mas os dois membros podem visualizá-lo no contexto familiar.
4. Compras parceladas projetam as parcelas futuras, sem duplicar a transação original no histórico mensal.
5. A entrega inclui automação financeira, cartões/faturas/parcelas e fechamento mensal.

## Escopo

### 1. Regras de automação

O usuário poderá criar regras por texto da descrição do lançamento.

- Critério inicial: descrição contém um texto, sem diferenciação entre maiúsculas/minúsculas e sem acentos.
- Efeito: preencher categoria; opcionalmente definir tipo (entrada ou saída).
- Propriedade: regra pessoal, aplicada apenas às transações do proprietário, inclusive dentro do contexto familiar.
- Prioridade: a regra mais específica (texto maior) vence; em empate, vence a mais antiga.
- Aplicação: novos lançamentos manuais e itens importados de CSV/OFX/QFX.
- Transparência: a prévia de importação mostrará a categoria sugerida antes da confirmação.
- Segurança: uma regra não altera transações antigas automaticamente nesta primeira versão.

### 2. Cartões, faturas e parcelas

Cada cartão terá:

- Nome de exibição, emissor opcional, quatro últimos dígitos opcionais e cor.
- Limite total.
- Dia de fechamento e dia de vencimento.
- Proprietário obrigatório e, opcionalmente, vínculo ao time familiar apenas para visibilidade compartilhada.
- Situação ativa ou arquivada.

Uma compra no cartão terá descrição, categoria, valor total, data da compra, quantidade de parcelas e referência ao cartão. A compra cria uma única `Transaction` de saída na data original; os dados de cartão são mantidos em registros próprios de compra e parcela.

O ciclo da fatura é determinado pelo dia de fechamento. Compras até o fechamento pertencem à fatura com vencimento seguinte; compras após o fechamento entram na próxima. O sistema calcula faturas de forma derivada, por cartão e ciclo, e permite marcar cada fatura como paga.

Para parcelas, a compra terá um cronograma de parcelas com valor distribuído de modo que a soma final coincida exatamente com o valor total. A primeira parcela pertence à fatura aplicável à data da compra; as próximas abastecem a previsão dos meses seguintes.

### 3. Fechamento mensal

O fechamento mensal apresentará, por contexto:

- Entradas, saídas e saldo do mês.
- Comparação percentual com o mês anterior, quando houver base de comparação.
- Categorias de maior gasto e situação de cada orçamento.
- Compras/parcelas que compõem as próximas faturas e total previsto para 30 dias.
- Lançamentos recorrentes previstos para o próximo mês.
- Uma lista curta de ações: orçamentos excedidos, faturas próximas do vencimento, metas sem progresso ou mês sem movimentações.

O contexto familiar agregará dados dos dois membros e identificará o autor de cada lançamento. O pessoal exibirá somente os dados do usuário atual.

## Modelo de dados proposto

### `TransactionRule`

```text
id, userId, matchText, category, type?, isActive, createdAt, updatedAt
```

Índice: `userId, isActive`.

### `CreditCard`

```text
id, userId, teamId?, name, issuer?, lastFour?, color,
limit, closingDay, dueDay, isActive, createdAt, updatedAt
```

Índices: `userId, isActive` e `teamId, isActive`.

### `CardPurchase`

```text
id, cardId, transactionId, userId, description, category,
totalAmount, purchaseDate, installments, createdAt, updatedAt
```

Há uma relação obrigatória e única com a `Transaction`, garantindo que a despesa não seja duplicada.

### `CardInstallment`

```text
id, purchaseId, number, dueMonth, amount, createdAt
```

Restrição única: `purchaseId, number`.

### `CardStatementPayment`

```text
id, cardId, dueMonth, paidAt, paidById?, createdAt, updatedAt
```

Restrição única: `cardId, dueMonth`. O registro é somente de estado da fatura, sem transação financeira adicional.

## API e autorização

Novos grupos de API, todos autenticados:

- `GET/POST/PATCH/DELETE /api/financial/rules`
- `GET/POST/PATCH/DELETE /api/financial/cards`
- `GET/POST/PATCH/DELETE /api/financial/card-purchases`
- `GET/POST /api/financial/card-statements`
- `GET /api/financial/monthly-close`

As rotas validarão o contexto com `resolveFinancialContext` e nunca aceitarão um `userId` fornecido pelo cliente. Um membro só pode criar/editar/remover o próprio cartão, compra e regra. No contexto familiar, ambos podem visualizar dados dos cartões dos membros, mas não alterar o cartão ou compra do outro membro. Marcar uma fatura como paga registra quem realizou a ação e é permitido aos dois membros do time.

## Interface

### Automação

Uma aba **Regras** em Financeiro mostrará regras ativas, seu efeito e um formulário simples para criar/editar/desativar regras. A importação de extrato passa a destacar as categorias automáticas na prévia.

### Cartões

A página atual de cartões será substituída por uma área funcional com:

- Cartões do contexto escolhido e consumo de limite no ciclo atual.
- Próxima fatura e vencimento.
- Modal para criar cartão.
- Detalhe do cartão: compras, lançamento de compra à vista ou parcelada e calendário das próximas parcelas.
- Marcação de fatura paga, com confirmação explícita.

### Fechamento

A página de relatórios receberá o bloco **Fechamento do mês**, com seletor de mês e contexto, indicadores comparativos, projeção de compromissos e ações recomendadas. O painel inicial exibirá um resumo conciso: fatura mais próxima, orçamento em risco e próxima recorrência.

## Fluxos principais

### Importar extrato com regra

1. Usuário seleciona um arquivo CSV/OFX/QFX.
2. Sistema interpreta o arquivo e aplica a regra ativa do proprietário a cada item importável.
3. Usuário confere a prévia, que preserva uma categoria fornecida pelo arquivo quando não existir regra.
4. Sistema evita duplicatas pelo identificador externo existente e grava somente itens novos.

### Registrar compra parcelada

1. Usuário escolhe um cartão próprio no contexto pessoal ou familiar.
2. Informa descrição, categoria, valor, data e número de parcelas.
3. Sistema cria uma saída única na data da compra, a compra de cartão e as parcelas projetadas.
4. A fatura vigente passa a incluir a parcela correspondente; os meses seguintes aparecem como previsão.

### Fechar o mês

1. Usuário abre Relatórios e escolhe mês/contexto.
2. Sistema agrega as transações reais daquele intervalo e busca as parcelas/recorrências futuras.
3. O usuário enxerga resultado, comparação, alertas e compromissos futuros sem contagem dupla da fatura.

## Fora de escopo nesta entrega

- Conciliação automática de cartão via Open Finance.
- Pagamento/iniciação de Pix.
- Rateio de uma compra entre membros.
- Edição ou exclusão de compras parceladas já consolidadas, além do fluxo de criação.
- OCR de recibos e notas fiscais.
- Modificação de transações antigas pela criação de uma regra.

## Critérios de aceite

1. Uma regra criada por um membro categoriza corretamente uma importação nova dele e não altera dados do outro membro.
2. Uma compra no cartão aparece como saída no dia da compra e também compõe exatamente uma fatura.
3. Uma compra em três parcelas projeta três valores cuja soma corresponde ao total informado.
4. Marcar uma fatura como paga não altera entradas, saídas ou saldo do período.
5. Os dois membros visualizam cartões e projeções no contexto familiar; somente o proprietário altera o próprio cartão e compras.
6. O fechamento mensal pessoal e familiar usa os filtros corretos e identifica o membro autor nas listas familiares.
7. Todas as rotas retornam 401 para usuário não autenticado e 403 para contexto sem acesso.
8. Migração Prisma, TypeScript, lint e build passam antes do deploy.
