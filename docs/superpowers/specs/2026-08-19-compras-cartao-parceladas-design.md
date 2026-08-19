# Compras de cartão à vista e parceladas

## Objetivo

Tornar o registro de compras de cartão fiel à fatura: permitir compras à vista ou parceladas, informar o valor de cada parcela, acompanhar a parcela atual de compras antigas e administrar cada compra sem afetar o cartão.

## Experiência de cadastro

O modal de compra terá uma escolha explícita entre **À vista** e **Parcelado**.

- À vista: o usuário informa a descrição, a data, a categoria e o valor da compra. O lançamento é registrado como `1/1`.
- Parcelado: o usuário informa a descrição, a data original da compra, a categoria, o valor de cada parcela e a quantidade total de parcelas. O valor total é calculado e mostrado como `valor da parcela × total de parcelas`.
- O sistema sugere a parcela atual a partir da data original da compra e da data atual. O usuário pode trocar a sugestão antes de salvar, para casos em que o fechamento da fatura ou o histórico real não coincidam com o cálculo.

Exemplo: uma compra iniciada em 22/01/2025 com 21 parcelas de R$ 272,40 pode ser registrada como `20/21`; o sistema considera somente a 20ª e a 21ª como pendentes, mantendo as anteriores apenas como histórico.

## Modelo e cálculo de parcelas

Cada compra continuará sendo uma única compra de cartão, vinculada à sua transação financeira. Para compras parceladas, o valor de cada parcela será preservado exatamente como informado — o sistema não dividirá esse valor novamente.

- O total da compra será calculado por `valorParcela × quantidadeParcelas`.
- Parcelas anteriores à parcela atual escolhida serão marcadas como históricas/pagas e não entrarão em faturas futuras nem em valores a pagar.
- A parcela atual e as posteriores serão programadas a partir do ciclo de fatura atual, respeitando o dia de fechamento do cartão.
- O histórico exibirá o progresso de maneira compacta, como `20/21`, o valor da parcela e quantas parcelas restam; não listará todas as parcelas antigas em uma linha extensa.
- Compras novas iniciam naturalmente em `1/N`, salvo ajuste manual do usuário.

## Faturas e histórico

As faturas mostrarão somente parcelas pendentes ou futuras. Compras antigas continuam visíveis no histórico do cartão para consulta, mas suas parcelas passadas não aparecem como valores em aberto.

O histórico separará visualmente:

- compra à vista (`1/1`);
- compra parcelada com parcela atual e saldo de parcelas restantes;
- compra encerrada, quando todas as parcelas já tiverem passado.

## Edição e exclusão

Cada item de compra terá ações próprias de **Editar** e **Excluir compra**.

- Editar abre o mesmo formulário preenchido e recalcula as parcelas pendentes sem alterar o cartão.
- Excluir compra remove a compra, a projeção de parcelas e sua transação financeira associada após confirmação.
- Arquivar ou excluir o cartão continuará sendo uma ação independente, identificada como ação do cartão e com confirmação específica.

## Erros e preservação de dados

O servidor validará valores positivos, parcelas entre 1 e 48 e uma parcela atual dentro do total informado. Valores serão tratados em centavos para impedir diferenças de arredondamento.

As compras já cadastradas permanecerão preservadas. O novo fluxo corrige os próximos cadastros e permite corrigir compras existentes por edição, sem apagar cartões.

## Verificação

Serão cobertos testes para: compra à vista; compra parcelada com valor de parcela; sugestão e ajuste da parcela atual; ausência de parcelas antigas nas faturas; edição; exclusão isolada da compra; e preservação do cartão.
