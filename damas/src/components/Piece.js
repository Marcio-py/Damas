import { Board, pieces, tiles } from "./Board";


export function Piece(element, position, board) {
  return {
    element,
    position,
    board,
    allowedtomove: true,
    player: element.attr("id") < 12 ? 1 : 2,
    king: false,

    makeKing() {
      this.element.css("backgroundImage", `url('img/king${this.player}.png')`);
      this.king = true;
    },

    move(tile) {
      this.element.removeClass("selected");

      if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) {
        return false;
      }

      if (
        this.player === 1 &&
        !this.king &&
        tile.position[0] < this.position[0]
      )
        return false;
      if (
        this.player === 2 &&
        !this.king &&
        tile.position[0] > this.position[0]
      )
        return false;

      // Atualiza a matriz do tabuleiro
      Board.board[this.position[0]][this.position[1]] = 0;
      Board.board[tile.position[0]][tile.position[1]] = this.player;

      this.position = [tile.position[0], tile.position[1]];

      this.element.css({
        top: Board.dictionary[this.position[0]],
        left: Board.dictionary[this.position[1]],
      });

      if (!this.king && (this.position[0] === 0 || this.position[0] === 7)) {
        this.makeKing();
      }
      return true;
    },

    canJumpAny() {
      return (
        this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] - 2])
      );
    },

    canOpponentJump(newPosition) {
      // Calcula o deslocamento
      var dx = newPosition[1] - this.position[1];
      var dy = newPosition[0] - this.position[0];
       // Impede movimento para trás se não for uma dama
      if (this.player == 1 && this.king == false) {
        if (newPosition[0] < this.position[0]) return false;
      } else if (this.player == 2 && this.king == false) {
        if (newPosition[0] > this.position[0]) return false;
      }
      // Verifica se está dentro dos limites do tabuleiro
      if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
       // Verifica a casa intermediária
      var tileToCheckx = this.position[1] + dx / 2;
      var tileToChecky = this.position[0] + dy / 2;
      if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
      // Verifica se existe uma peça oponente e a próxima casa está vazia
      if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
        // verifica a insancia do objeto que esta no local verificado no codigo acima
        for (let pieceIndex in pieces) {
          if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
            if (this.player != pieces[pieceIndex].player) {
              //return the piece sitting there
              return pieces[pieceIndex];
            }
          }
        }
      }
      return false;
    },

    opponentJump(tile) {
      const pieceToRemove = this.canOpponentJump(tile.position);
      console.log("jumped:" + pieceToRemove);
      if (pieceToRemove) {
        pieceToRemove.remove();
        return true;
      }
      return false;
    },

    remove() {
      this.element.css("display", "none");
      Board.board[this.position[0]][this.position[1]] = 0;
      this.position = [];
      if(Board.checkifAnybodyWon()) {
        alert("Player " + Board.playerTurn + " won!");
      } //todo: verifica se há um vencedor
    },
  };
}
