# Checkers Game - Jogo de Damas

Este é um projeto de jogo de damas desenvolvido em JavaScript, HTML e CSS. O jogo permite que dois jogadores se enfrentem em um tabuleiro de damas tradicional, com regras de movimentação, saltos obrigatórios e promoção para rei (dama).

## Funcionalidades

- Jogabilidade para dois jogadores.
- Movimentação de peças de acordo com as regras oficiais de damas.
- Regras de captura obrigatória de peças.
- Promoção de peças para rei ao atingir a última linha do tabuleiro.
- Detecção de vencedor quando um jogador captura todas as peças do oponente.
- Interface interativa usando jQuery para manipulação de elementos DOM.
- Reinício de jogo via botão de "Limpar Jogo".

## Estrutura do Projeto

📁 /src 
  ├── 📄 main.js # Iniciar o Object Board e gerir os eventos
    📁 /components 
        ├── 📄 Board.js # Lógica do tabuleiro e estado do jogo 
        ├── 📄 Piece.js # Lógica de movimentação e captura de peças 
        ├── 📄 Tile.js # Lógica das casas do tabuleiro

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página web.
- **CSS3**: Estilização da interface do jogo.
- **JavaScript (ES6)**: Lógica de interação e movimentação das peças.
- **jQuery**: Manipulação de DOM para seleção e movimentação de peças.
