# Finanças pessoais e familiares

## Objetivo

Evoluir o WhatSpent para permitir que duas pessoas controlem as próprias finanças e acompanhem, de forma transparente, a vida financeira familiar. A integração não depende de Open Finance ou WhatsApp.

## Modelo de espaços

Cada usuário possui um espaço pessoal privado. Um administrador pode criar um espaço do tipo `FAMILY` e convidar outro usuário por link único. O administrador e os membros têm acesso às informações financeiras do espaço Família, sem rateio entre pessoas.

Lançamentos pessoais continuam pertencendo ao autor. No contexto Família, o produto consolida os lançamentos de todos os membros e exibe o autor de cada item. Lançamentos criados diretamente no espaço Família também pertencem ao usuário que os criou, mas são visíveis a todos os membros.

## Permissões

- Administrador: cria, revoga e consulta convites; remove membros; cria e edita dados financeiros.
- Membro: vê, cria, edita e exclui dados financeiros aos quais tem acesso; não administra participantes nem convites.
- Espaços pessoais são privados. A consolidação familiar só considera os membros do espaço Família.

## Convites

O administrador gera um link com token aleatório, uso único e expiração. Ao abrir o link, a pessoa deve autenticar-se ou cadastrar-se. Na aceitação, ela é incluída como `MEMBER`; o convite é marcado como usado. O administrador pode revogar links ainda não utilizados.

## Contextos financeiros

O seletor de contexto será persistido na URL e terá três opções quando a Família possuir dois membros: o espaço pessoal do usuário, o espaço pessoal do outro membro e Família. Nas telas financeiras, qualquer usuário pode escolher seu espaço pessoal ou Família. A visão consolidada da Família inclui todos os lançamentos de membros, independentemente de terem sido criados no contexto pessoal ou familiar.

## Orçamentos e metas

Cada orçamento tem contexto, categoria, mês de referência e valor-limite. Cada meta tem contexto, nome, valor-alvo, valor atual e prazo opcional. O avanço das metas será manual inicialmente; importações ou regras automáticas não fazem parte desta etapa.

## Recorrências

Uma recorrência pertence a um contexto e a um criador, com descrição, categoria, tipo, valor, frequência, próxima data e estado ativo. O sistema cria lançamentos previstos/efetivados uma vez por período, de forma idempotente. O painel apresentará a projeção de saldo com base nas recorrências futuras.

## Relatórios e alertas

Os relatórios apresentam saldo, entradas, saídas, gastos por categoria, evolução mensal e próximos vencimentos para o contexto selecionado. Para Família, os totais consolidam todos os membros e os detalhes exibem o autor.

Alertas pessoais são enviados somente ao dono do espaço pessoal. Alertas de Família são enviados a todos os membros: orçamento próximo/ultrapassado, recorrência a vencer, resumo semanal e resumo mensal. O Resend continua sendo o provedor de e-mail.

## Importação

CSV/OFX/QFX continua a importar para o usuário autenticado, com seleção explícita do contexto permitido. O usuário poderá importar para sua área pessoal ou, quando fizer parte dela, para Família. Duplicidades continuam bloqueadas pelo identificador externo quando disponível.

## Erros e segurança

Todas as operações no servidor validam a participação no espaço antes de ler ou alterar dados. Links de convite não revelam dados antes de autenticados. Tokens não são retornados após criação. Ações idempotentes são usadas para gerar lançamentos recorrentes e enviar alertas.

## Entrega incremental

1. Espaços, membros, convites e seletor de contexto.
2. Orçamentos, metas e recorrências.
3. Painéis, relatórios e projeções.
4. Alertas de e-mail e aprimoramentos da importação.
