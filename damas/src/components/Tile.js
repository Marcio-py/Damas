import { Board, pieces, tiles, dist } from './Board.js';

// Objeto Tile - representa uma casa no tabuleiro
   export function Tile(element, position) {
    this.element = element; // Elemento DOM associado à casa
    this.position = position; // Posição no tabuleiro (linha, coluna)

    // se tile está no alcance da peça
    this.inRange = function (piece) {
      for (let k of pieces)
        if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';
      if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) return 'wrong';
      if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) return 'wrong';
      if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
        //movimento normal
        return 'regular';
      } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
        //movimento de salto/captura
        return 'jump';
      }
    };
  }