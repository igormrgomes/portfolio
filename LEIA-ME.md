# Portfólio — Igor

Site de uma página só, feito com HTML, CSS e JavaScript puros (sem bibliotecas).

## Arquivos (todos na MESMA pasta, ao lado do index.html)

| Arquivo | Para que serve |
|---|---|
| `index.html` | O site (a foto já está embutida nele) |
| `style.css` | Visual e responsividade |
| `script.js` | Interações, formulário e modais dos projetos |
| `Curriculo_Igor_de_Moura_Gomes.pdf` | Currículo (botões "Baixar currículo") |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png` | Ícone da aba e do iPhone |
| `icon-192.png`, `icon-512.png`, `site.webmanifest` | Ícone no Android / tela inicial |

## Prints dos projetos

Os prints dos 3 projetos já estão dentro do `index.html` (não precisa de arquivo de imagem).
Para trocar um print no futuro, me mande a imagem nova.

## Formulário de contato

Envia pelo Formspree (`https://formspree.io/f/xeaejnqa`, método POST). O endereço fica
no atributo `action` do `<form>` no `index.html`.
Depois de publicar, envie uma mensagem de teste para confirmar que chega no seu e-mail.

## Projetos

1. **MoneyUp — Landing Page** — https://igormrgomes.github.io/MoneyUp/
2. **Foco — Quadro de Tarefas** — https://igormrgomes.github.io/foco/
3. **Tempo — Previsão do Tempo** — https://igormrgomes.github.io/tempo/

Os textos do botão "Detalhes" e os links de demo e GitHub ficam em `dadosProjetos`, no `script.js`.

## Contatos usados no site

- Telefone: (31) 98368-8904
- E-mail: igor1.trabalho@gmail.com
- GitHub: github.com/igormrgomes
- LinkedIn: linkedin.com/in/igor-gomes-50b1b83b3
- Local: Belo Horizonte, MG

## Ícones

Os ícones são SVG e ficam num "sprite" logo depois de `<body>` no `index.html`.
Para usar um: `<svg class="icon" aria-hidden="true"><use href="#i-nome"/></svg>`.
No `script.js`, use `icone('nome')`. Os alertas recebem o tipo:
`mostrarAlerta('sucesso' | 'erro' | 'aviso', título, texto)`.

## Para publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos da tabela acima.
2. Em Settings > Pages, escolha a branch `main` e a pasta `/ (root)`.
3. Aguarde 1 a 2 minutos e abra o link gerado.

## Para ajustar depois

- Barras de "Nível de domínio" (Habilidades): números no `index.html` (`data-level`).
- Estatísticas do início: `data-count` no `index.html`.
- Frases digitadas no topo: lista `frases` no `script.js`.
- Cores: variáveis no começo do `style.css`.

## Celular

- Habilidades em cards compactos (ícone ao lado do texto) e números em grade 2x2.
- Campos do formulário com 16px, para o iPhone não dar zoom ao tocar.
- Sem rolagem lateral em 360px, 390px, tablet e desktop (testado).
