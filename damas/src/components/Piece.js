// Importa o módulo Board, a lista de peças e tiles do tabuleiro
import { Board, pieces, tiles } from "./Board";

// Função Piece que cria um objeto para cada peça do jogo
export function Piece(element, position, board) {
  return {
    // Propriedades principais da peça
    element,               // Elemento HTML associado à peça
    position,              // Posição atual da peça no tabuleiro
    board,                 // Referência ao tabuleiro
    allowedtomove: true,    // Indica se a peça está permitida a se mover
    player: element.attr("id") < 12 ? 1 : 2,  // Define o jogador (1 ou 2) com base no ID da peça
    king: false,           // Estado de 'dama' da peça, por padrão começa como falso

    // Método que transforma a peça em uma dama
    makeKing() {
      // Altera a imagem de fundo da peça para indicar que virou dama
      this.element.css("backgroundImage", `url('../../img/king${this.player}.png')`);
      this.king = true; // Atualiza o estado de 'dama'
    },

    // Método para mover a peça para um tile específico
    move(tile) {
      // Remove a classe CSS 'selected' da peça
      this.element.removeClass("selected");

      // Verifica se o movimento é para um local válido no tabuleiro
      if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) {
        return false; // Se o movimento for inválido, retorna false
      }

      // Verifica se o jogador 1 está tentando mover para trás sem ser dama
      if (this.player === 1 && !this.king && tile.position[0] < this.position[0])
        return false;
      // Verifica se o jogador 2 está tentando mover para trás sem ser dama
      if (this.player === 2 && !this.king && tile.position[0] > this.position[0])
        return false;

      // Atualiza a matriz do tabuleiro para mover a peça
      Board.board[this.position[0]][this.position[1]] = 0;  // Remove peça da posição anterior
      Board.board[tile.position[0]][tile.position[1]] = this.player; // Coloca a peça na nova posição

      // Atualiza a posição da peça
      this.position = [tile.position[0], tile.position[1]];

      // Atualiza a posição visual da peça (CSS)
      this.element.css({
        top: Board.dictionary[this.position[0]],   // Define a nova posição 'top' no CSS
        left: Board.dictionary[this.position[1]],  // Define a nova posição 'left' no CSS
      });

      // Verifica se a peça precisa ser promovida a dama
      if (!this.king && (this.position[0] === 0 || this.position[0] === 7)) {
        this.makeKing();  // Promove a peça a dama
      }
      return true;  // Retorna sucesso no movimento
    },

    // Método que verifica se a peça pode capturar qualquer outra peça
    canJumpAny() {
      return (
        // Verifica as quatro possíveis direções de captura (diagonais)
        this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] - 2])
      );
    },

    // Método que verifica se uma peça adversária pode ser capturada ao pular para uma nova posição
    canOpponentJump(newPosition) {
      // Calcula a diferença nas coordenadas da nova posição
      var dx = newPosition[1] - this.position[1];
      var dy = newPosition[0] - this.position[0];

      // Impede o movimento para trás se a peça não for dama
      if (this.player == 1 && this.king == false) {
        if (newPosition[0] < this.position[0]) return false;
      } else if (this.player == 2 && this.king == false) {
        if (newPosition[0] > this.position[0]) return false;
      }

      // Verifica se a nova posição está dentro dos limites do tabuleiro
      if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) 
        return false;

      // Verifica a casa intermediária (onde estaria a peça a ser capturada)
      var tileToCheckx = this.position[1] + dx / 2;
      var tileToChecky = this.position[0] + dy / 2;

      // Verifica se a casa intermediária está dentro dos limites do tabuleiro
      if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) 
        return false;

      // Verifica se há uma peça oponente para ser capturada
      if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
        // Procura na lista de peças por uma peça adversária na casa intermediária
        for (let pieceIndex in pieces) {
          if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
            if (this.player != pieces[pieceIndex].player) {
              // Retorna a peça que pode ser capturada
              return pieces[pieceIndex];
            }
          }
        }
      }
      return false; // Se não houver peça para capturar, retorna falso
    },

    // Método para realizar a captura de uma peça adversária
    opponentJump(tile) {
      const pieceToRemove = this.canOpponentJump(tile.position); // Verifica se há uma peça para capturar
      console.log("jumped:" + pieceToRemove); // Exibe no console qual peça foi capturada
      if (pieceToRemove) {
        pieceToRemove.remove(); // Remove a peça capturada
        return true; // Captura bem-sucedida
      }
      return false; // Não houve captura
    },

    // Método para remover a peça do jogo
    remove() {
      this.element.css("display", "none"); // Esconde a peça visualmente
      Board.board[this.position[0]][this.position[1]] = 0; // Remove a peça da matriz do tabuleiro
      this.position = []; // Zera a posição da peça

      // Verifica se alguém ganhou o jogo
      if(Board.checkifAnybodyWon()) {
        alert("Player " + Board.playerTurn + " won!"); // Exibe mensagem de vitória
      }
    },
  };
}
