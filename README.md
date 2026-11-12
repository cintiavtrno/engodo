# Engodo

Jogo de 15 minutos em três.js. Naná é leiturista da companhia de água. No dia em que a rua dela é incluída na Fila do desenvolvimento, ela precisa chegar à noite com a casa ainda sendo casa, água na caixa e gente ao lado para decidir.

Título provisório. Cíntia Vitorino Independent Games.

## Como rodar

Abra `index.html` por um servidor local (por exemplo `python3 -m http.server`) ou publique a pasta no GitHub Pages. O jogo só depende do three.js r128, carregado por CDN.

## Pastas

| Caminho | O que tem |
| --- | --- |
| `index.html` | Página do jogo: telas de abertura, menu, tutorial e HUD |
| `css/jogo.css` | Interface |
| `js/base.js` | Utilidades, texturas procedurais, luz e o modelo da casa |
| `js/personagens.js` | `criarFigura`, os nove personagens e a Fila |
| `js/casa.js` | Elenco na rua, aberturas, andar e conversar |
| `js/motor.js` | Estado do dia (Água, Medida, Voz), falas com escolha, motor lateral das fases, inimigos |
| `js/ui.js` | Abertura, menu, como jogar, tutorial de cada fase, botões de toque |
| `js/fases/` | Uma fase por arquivo |
| `js/fim.js` | Laço de animação |
| `modelos/casa.html` | Modelo original da casa, sozinho |
| `modelos/personagens.html` | Ateliê com os personagens, em duplas |

## Fases prontas

1. Leitura (Garagem)
2. Compradora (Sala)
3. Tempos modernos (Quintal)
4. A obra (Escadaria)
5. O livro (Dentro da Caixa)

Faltam: Um por cento, Concessão, Na minha opinião, os interlúdios na Fila, o relógio do dia e a assembleia.

## Para criar uma fase

Copie um arquivo de `js/fases/`, registre em `FASES[n]` com `monta`, `comeca`, `tick`, `anim` e `decide`, acrescente o texto do tutorial em `TUT` (`js/ui.js`) e inclua o script no `index.html`.
