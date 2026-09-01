# WhatSpent: atualização de marca na landing

## Objetivo

Aplicar a identidade oficial do WhatSpent à página inicial pública, substituindo os ativos provisórios e a paleta escura/roxa herdada. A jornada de cadastro já publicada permanece inalterada.

## Ativos oficiais

- Logotipo horizontal: imagem enviada pelo usuário com a palavra `whatspent` em verde.
- Ícone: imagem enviada pelo usuário com `WS` branco sobre quadrado verde arredondado.
- Ambos serão convertidos em PNG com canal alfa, sem o fundo branco original, e armazenados em `public/brand/` sem sobrescrever os arquivos existentes.

## Direção visual aprovada

Usar verde WhatSpent como cor principal, com verde mais profundo para contraste e verde claro para superfícies. A landing terá fundo claro, texto verde-escuro e gradientes verdes discretos. Elementos roxos, rosas e a marca Fugleman serão removidos da página pública.

## Componentes afetados

1. Cabeçalho e rodapé passam a usar o logotipo horizontal oficial.
2. Favicon/app icon e marcas dos mockups usam o ícone oficial WS.
3. Hero, botões, badges, cartões e detalhes decorativos adotam os tokens verdes.
4. O comportamento das rotas, CTAs e formulários de cadastro/login não muda.

## Critérios de aceite

- Os dois arquivos finais têm fundo transparente e preservam legibilidade.
- Não restam referências visuais à paleta roxa/rosa nem ao nome Fugleman na landing.
- O logotipo aparece nítido em fundo claro e o ícone aparece em tamanhos pequenos.
- A landing mantém layout responsivo, sem rolagem horizontal.
- Lint, tipos, testes e build passam; a prévia e a produção são verificadas no navegador.

## Riscos e contenção

A remoção do fundo por IA pode alterar as bordas das letras. Os arquivos originais não serão modificados; os recortes serão revisados antes de entrar no projeto. O redesign se limita à página pública e aos seus ativos, evitando alteração em dados, autenticação ou WhatsApp.
