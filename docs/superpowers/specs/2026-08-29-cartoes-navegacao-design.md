# Ajustes de cartões e navegação

## Objetivo

Corrigir a exibição da próxima fatura do cartão Magalu, restaurar o logo no cabeçalho, ampliar as opções de cor para cartões e fechar os menus ao clicar fora.

## Decisões

### Faturas

A API de faturas será explicitamente dinâmica e responderá com Cache-Control: no-store. A tela de cartões fará a mesma solicitação sem cache. Assim, o resumo e o detalhe usam a mesma fonte atualizada e exibem a fatura de setembro do Magalu em R$ 1.153,81.

### Logo

O cabeçalho deixará de depender de uma imagem PNG não rastreada, que foi omitida no pacote de produção. Será usado um wordmark SVG versionado em public/, com texto alternativo adequado.

### Paleta de cartões

A seleção passará de seis para doze cores, preservando as seis atuais e adicionando variações azul-marinho, vinho, dourado, coral, lavanda e grafite. A API continuará aceitando qualquer cor hexadecimal válida.

### Menus

O menu principal será controlado por estado React, em vez de elementos details nativos. Um único menu pode permanecer aberto. Clique fora, Escape e abertura de outro menu fecham o painel ativo; links também o fecham antes da navegação.

## Validação

- Teste da rota de faturas cobre resposta sem cache e intervalo mensal.
- Testes do menu cobrem clique fora e Escape.
- Teste de interface verifica as doze escolhas de cor.
- Build de produção e inspeção visual confirmam logo presente e valores atualizados.
