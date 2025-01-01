import { Tile } from "./Tile.js";
import { Piece } from "./Piece.js";

// Objeto Board - representa o tabuleiro do jogo

// Configuração inicial
var gameBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];
// Arrays para armazenar as instâncias
var pieces = []; // Peças do jogo
var tiles = []; // Casas do tabuleiro

// Fórmula de distância
export var dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

 var Board = {
  board: gameBoard,
  score: {
    player1: 0,
    player2: 0,
  },
  playerTurn: 1,
  jumpexist: false,
  continuousjump: false,
  tilesElement: $("div.tiles"),
  // dicionario para converter posicao no objeto Board em viewport
  dictionary: [
    "0vmin",
    "10vmin",
    "20vmin",
    "30vmin",
    "40vmin",
    "50vmin",
    "60vmin",
    "70vmin",
    "80vmin",
    "90vmin",
  ],

  //inicialisar tabuleiro 8x8
  initalize: function () {
    var countPieces = 0;
    var countTiles = 0;
    for (let row in this.board) {
      //Linha é o indice
      for (let column in this.board[row]) {
        //coluna é o indice
        //todo o conjunto de if controla onde as peças
        //  e peças devem ser colocadas no tabuleiro
        if (row % 2 == 1) {
          if (column % 2 == 0) {
            countTiles = this.tileRender(row, column, countTiles);
          }
        } else {
          if (column % 2 == 1) {
            countTiles = this.tileRender(row, column, countTiles);
          }
        }
        if (this.board[row][column] == 1) {
          countPieces = this.playerPiecesRender(1, row, column, countPieces);
        } else if (this.board[row][column] == 2) {
          countPieces = this.playerPiecesRender(2, row, column, countPieces);
        }
      }
    }
  },
  tileRender: function (row, column, countTiles) {
    this.tilesElement.append(
      "<div class='tile' id='tile" +
        countTiles +
        "' style='top:" +
        this.dictionary[row] +
        ";left:" +
        this.dictionary[column] +
        ";'></div>"
    );
    tiles[countTiles] = new Tile($("#tile" + countTiles), [
      parseInt(row),
      parseInt(column),
    ]);
    return countTiles + 1;
  },

  playerPiecesRender: function (playerNumber, row, column, countPieces) {
    $(`.player${playerNumber}pieces`).append(
      "<div class='piece' id='" +
        countPieces +
        "' style='top:" +
        this.dictionary[row] +
        ";left:" +
        this.dictionary[column] +
        ";'></div>"
    );
    pieces[countPieces] = new Piece($("#" + countPieces), [
      parseInt(row),
      parseInt(column),
    ]);
    return countPieces + 1;
  },
  //verifica se localizaçao tem um objeto
  isValidPlacetoMove: function (row, column) {
    // console.log(row); console.log(column); console.log(this.board);
    if (row < 0 || row > 7 || column < 0 || column > 7) return false;
    if (this.board[row][column] == 0) {
      return true;
    }
    return false;
  },
  //altera o jogador ativo - também altera o CSS do div.turn
  changePlayerTurn: function () {
    if (this.playerTurn == 1) {
      this.playerTurn = 2;
      $(".turn").css(
        "background",
        "linear-gradient(to right, transparent 50%, #BEEE62 50%)"
      );
    } else {
      this.playerTurn = 1;
      $(".turn").css(
        "background",
        "linear-gradient(to right, #BEEE62 50%, transparent 50%)"
      );
    }
    this.check_if_jump_exist();
    return;
  },
  checkifAnybodyWon: function () {
    if (this.score.player1 == 12) {
      return 1;
    } else if (this.score.player2 == 12) {
      return 2;
    }
    return false;
  },
  //recomeça o jogo
  clear: function () {
    location.reload();
  },
  check_if_jump_exist: function () {
    this.jumpexist = false;
    this.continuousjump = false;
    for (let k of pieces) {
      k.allowedtomove = false;
      // se o salto/captura existir, defina apenas as peças de "salto" "com permissão para se mover"
      if (
        k.position.length != 0 &&
        k.player == this.playerTurn &&
        k.canJumpAny()
      ) {
        this.jumpexist = true;
        k.allowedtomove = true;
      }
    }
    // se o salto não existir, todas as peças podem se mover
    if (!this.jumpexist) {
      for (let k of pieces) k.allowedtomove = true;
    }
  },
  // Possivelmente útil para comunicação com back-end.
  str_board: function () {
    ret = "";
    for (let i in this.board) {
      for (let j in this.board[i]) {
        var found = false;
        for (let k of pieces) {
          if (k.position[0] == i && k.position[1] == j) {
            if (k.king) ret += this.board[i][j] + 2;
            else ret += this.board[i][j];
            found = true;
            break;
          }
        }
        if (!found) ret += "0";
      }
    }
    return ret;
  },
};

export {Board, pieces, tiles };

// --------------------------- fim do codigo original ---------------------------