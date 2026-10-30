# Nexa Core — landing page institucional

Landing page responsiva da Nexa Core, empresa de software em desenvolvimento com visão de criar soluções de gestão empresarial. O projeto atual do PIM é uma plataforma de gerenciamento de funcionários, iniciada no terceiro semestre de Análise e Desenvolvimento de Sistemas (ADS) e em aprimoramento no quarto e último semestre. Fluxo de caixa, estoque e sistemas de caixa/PDV aparecem como possibilidades futuras, não como produtos disponíveis.

## Abrir localmente

Abra `index.html` em um navegador moderno. Para desenvolvimento, sirva a pasta com a extensão Live Server do VS Code ou outro servidor HTTP local.

## Identidade visual

Paleta azul-petróleo, ciano e lavanda para acompanhar o logo, com superfícies escuras menos saturadas e contraste alto para leitura.

## Estrutura

- `index.html` — apresentação da empresa, missão, valores, visão de soluções, produto atual, metadados e estrutura semântica.
- `assets/site.css` — identidade visual, layouts responsivos, animações e estados de interação.
- `assets/site.js` — progresso de rolagem, navegação, narrativa, demonstração e formulário.
- `assets/nexacore-logo.png` — logo fornecido, recortado para uso sobre o fundo escuro da página.

HTML, CSS e JavaScript nativos; sem dependências de runtime. A página carrega Manrope e DM Mono pelo Google Fonts quando há conexão, com alternativas locais no CSS.

## Interações

- Indicador de progresso, navegação sincronizada com a seção ativa e narrativa ativada conforme a rolagem.
- Profundidade sutil no visual principal para ponteiro/mouse; respeita `prefers-reduced-motion`.
- Navegação recolhível para telas menores e atalhos de teclado para foco e fechamento com Escape.
- Demonstração do produto com visões de resumo, pessoas, equipes e indicadores; os controles mantêm o estado sincronizado e são acessíveis por teclado.

## Demonstração e dados

Os números, gráficos, perfis e nomes dentro do dashboard são fictícios e servem apenas para demonstrar uma direção de interface. Não representam clientes, resultados, operação real ou métricas conectadas. A página identifica o ambiente como demonstrativo.

## Contato

O formulário abre uma mensagem no Gmail endereçada a `contato@nexacore.example`. A pessoa revisa e envia pelo Gmail; o site não envia nem armazena dados em um servidor. Esse endereço é usado na apresentação. Para transformar o formulário em um canal real de atendimento, confirme uma caixa de entrada válida ou conecte um serviço de formulários.

Para captar contatos diretamente no site, conecte um backend ou serviço de formulários e publique uma política de privacidade adequada. A seção de soluções distingue o projeto atual (gestão de funcionários) das possibilidades futuras (fluxo de caixa, estoque e PDV). Antes de publicar comercialmente, confirme que missão, valores, público, serviços e escopo refletem as decisões reais da equipe.
