# Registro de Decisões - Fugleman Landing Page

## Tecnologias Escolhidas
- **Next.js 15 (App Router)**: Framework principal para React, garantindo performance e SEO.
- **Tailwind CSS**: Estilização utility-first, permitindo desenvolvimento rápido e coeso.
- **shadcn/ui**: Componentes de interface base (Button, Card, Input, Label) que oferecem um design limpo e acessível, além de permitirem customização completa.
- **Lucide Icons**: Biblioteca de ícones modernos e leves para uso nas interfaces.

## Estrutura da Landing Page
Baseada no `Landingpage.md` fornecido, a página foi dividida nas seguintes seções:
1. **Hero**: Proposta de valor central ("Um assessor pessoal. Direto no seu bolso.") com simulação de chat do WhatsApp demonstrando o uso imediato (gasto no Uber).
2. **Controle Financeiro**: Foco no resumo do dia, categorização automática com mockup do Dashboard (Ifood, Uber).
3. **Agenda Inteligente**: Destaque para lembretes diários e sincronização com Google Agenda, usando mockup de compromissos.
4. **Open Finance**: Seção em tema escuro para transmitir segurança (LGPD, Criptografia, +110 instituições).
5. **Drive Inteligente & Projetos**: Apresenta a funcionalidade de buscar documentos por significado ("Ache o comprovante...") e dividir projetos em tarefas.
6. **Conta Compartilhada**: Mostra a viabilidade de uso por família, sócios, e equipe.
7. **Oferta (Pricing)**: Destaca o valor acessível (R$ 49/mês), 50% OFF, e garantia de 7 dias, junto ao checklist de vantagens inclusas.
8. **Rodapé (Footer)**: Links de utilidade, copyright e lembrete de conformidade LGPD.

## Copywriting e Tom de Voz
- Aderência aos princípios do `copywriting.md` e `humanizer.md`:
  - **Clareza > Cleverness**: Frases curtas e diretas ("Anote seus gastos por áudio ou texto.").
  - **Especificidade**: "gastei 45 reais no uber" e mockups precisos ao invés de mensagens vagas.
  - **Sem exageros (humanizer)**: Remoção de jargões corporativos vazios; a oferta é feita como um produto útil e real que resolve um problema cotidiano.
  - A voz é de um assistente moderno, resolutivo e seguro.

## Ajustes Técnicos Realizados
- Corrigidos problemas de dependência do `shadcn/ui` forçando `react@latest` e resolvendo `peer-deps`.
- Adicionado o utilitário `cn` manualmente devido à falha de inicialização automática do shadcn, para garantir a compilação correta.
