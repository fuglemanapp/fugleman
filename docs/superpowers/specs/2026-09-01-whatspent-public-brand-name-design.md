# Whatspent: alinhamento público de marca para OAuth

## Objetivo

Fazer com que o nome textual e os metadados públicos em `whatspent.com` usem `Whatspent` (W maiúsculo e as demais letras minúsculas), a mesma grafia persistida pelo Google OAuth. A alteração elimina a divergência de marca que impede a verificação do consentimento OAuth.

## Escopo

- Atualizar o título padrão, o template de títulos e a descrição em `src/app/layout.tsx`.
- Atualizar referências textuais e textos alternativos da landing em `src/app/page.tsx`.
- Atualizar referências textuais em páginas institucionais públicas quando elas pertencem à landing.
- Manter as imagens oficiais existentes, cuja marca gráfica é `whatspent` em minúsculas.

## Fora de escopo

- Não alterar autenticação, permissões Google Calendar, URLs OAuth, banco de dados ou fluxo do dashboard.
- Não alterar rotas, comportamento de cadastro, preços ou funcionalidades.
- Não renomear identificadores técnicos, variáveis de ambiente, domínios ou o número oficial do WhatsApp.

## Decisão de marca

O texto público será `Whatspent`. O logotipo continuará sendo usado sem alterações. Isso torna o conteúdo que o Google rastreia consistente com o nome aceito pela configuração OAuth e preserva o ativo visual oficial.

## Implementação

1. Criar uma constante compartilhada de marca na camada de landing ou usar uma única definição local, evitando variações futuras de capitalização.
2. Aplicar a definição aos títulos e à descrição de metadados globais.
3. Aplicar a mesma definição às referências visíveis, `alt` e `aria-label` da landing.
4. Conferir que a página inicial renderizada, o título do navegador e o HTML acessível mostram a grafia aprovada.

## Validação

- Executar lint e build de produção.
- Executar os testes de marca/landing existentes, quando disponíveis.
- Inspecionar o HTML renderizado da página inicial para confirmar `Whatspent` no título, na descrição e na identificação principal.
- Confirmar que nenhuma URL, rota, configuração OAuth ou integração foi alterada.

## Resultado esperado

Após o deploy, o Google OAuth encontrará o mesmo nome no campo do app e na página inicial. O usuário poderá reenviar a verificação de branding e, quando aprovada, prosseguir para a verificação dos escopos de Google Calendar.
