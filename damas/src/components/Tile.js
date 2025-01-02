// Importa a lista de peças e a função de cálculo de distância do módulo Board.js
import { pieces, dist } from './Board.js';

// Objeto Tile - representa uma casa no tabuleiro
export function Tile(element, position) {
  this.element = element;   // Elemento DOM associado à casa (tile) no tabuleiro
  this.position = position; // Posição no tabuleiro (representada como [linha, coluna])

  // Método que verifica se o tile (casa) está no alcance de movimento de uma peça
  this.inRange = function (piece) {
    // Verifica se já existe uma peça na posição do tile atual
    for (let k of pieces) {
      // Se uma peça está na mesma posição que o tile, retorna 'wrong' (movimento inválido)
      if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) 
        return 'wrong';
    }

    // Verifica se a peça é um peão (não é dama) e impede movimentos para trás
    if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) 
      return 'wrong'; // Peão do jogador 1 só pode avançar, não pode mover para trás
    if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) 
      return 'wrong'; // Peão do jogador 2 só pode avançar, não pode mover para trás

    // Verifica se a distância do tile à peça é equivalente a um movimento normal (uma casa diagonal)
    if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
      // Movimento válido de uma casa na diagonal
      return 'regular'; // Retorna 'regular' para indicar um movimento simples
    } 
    // Verifica se a distância do tile à peça é equivalente a um movimento de salto (captura)
    else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
      // Movimento válido de salto (captura), duas casas na diagonal
      return 'jump'; // Retorna 'jump' para indicar um movimento de captura
    }
  };
}
