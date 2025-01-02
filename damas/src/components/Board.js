import { Tile } from "./Tile.js";
import { Piece } from "./Piece.js";

// Objeto Board - representa o tabuleiro do jogo de damas

// Configuração inicial do tabuleiro. O número 1 representa as peças do jogador 1 e o 2 representa as peças do jogador 2.
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

// Arrays para armazenar as instâncias das peças e das casas do tabuleiro
var pieces = []; // Peças do jogo
var tiles = []; // Casas do tabuleiro

// Função para calcular a distância entre duas posições (usada para verificar movimentos)
export var dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

// Objeto Board - controla as funcionalidades do tabuleiro
var Board = {
  board: gameBoard, // Tabuleiro inicial
  score: {
    player1: 0, // Pontuação do jogador 1
    player2: 0, // Pontuação do jogador 2
  },
  playerTurn: 1, // Controle de turno (1 para jogador 1 e 2 para jogador 2)
  jumpexist: false, // Indica se há uma jogada de captura disponível
  continuousjump: false, // Indica se há um salto contínuo em andamento
  tilesElement: $("div.tiles"), // Elemento HTML que contém as casas do tabuleiro
  // Dicionário para converter as posições do tabuleiro em coordenadas de viewport (vmin)
  dictionary: [
    "0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin",
  ],

  // Função para inicializar o tabuleiro e renderizar as peças e casas
  initalize: function () {
    var countPieces = 0;
    var countTiles = 0;
    for (let row in this.board) {
      for (let column in this.board[row]) {
        // Se a posição for válida para uma casa (intercalada em um tabuleiro de damas)
        if (row % 2 == 1) {
          if (column % 2 == 0) {
            countTiles = this.tileRender(row, column, countTiles); // Renderiza as casas
          }
        } else {
          if (column % 2 == 1) {
            countTiles = this.tileRender(row, column, countTiles); // Renderiza as casas
          }
        }
        // Renderiza as peças do jogador 1 ou jogador 2, dependendo da posição
        if (this.board[row][column] == 1) {
          countPieces = this.playerPiecesRender(1, row, column, countPieces);
        } else if (this.board[row][column] == 2) {
          countPieces = this.playerPiecesRender(2, row, column, countPieces);
        }
      }
    }
  },

  // Função para renderizar uma casa (tile) no tabuleiro
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
    tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]); // Cria uma nova casa (Tile)
    return countTiles + 1;
  },

  // Função para renderizar uma peça do jogador no tabuleiro
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
    pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]); // Cria uma nova peça (Piece)
    return countPieces + 1;
  },

  // Função para verificar se a posição é válida para mover uma peça (sem obstáculos)
  isValidPlacetoMove: function (row, column) {
    if (row < 0 || row > 7 || column < 0 || column > 7) return false; // Fora dos limites
    if (this.board[row][column] == 0) {
      return true; // Casa vazia, movimento válido
    }
    return false; // Casa ocupada, movimento inválido
  },

  // Função para alternar o turno do jogador e atualizar o CSS visual de indicação de turno
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
    this.check_if_jump_exist(); // Verifica se existem saltos disponíveis
    return;
  },

  // Função para verificar se algum jogador venceu (atingiu 12 capturas)
  checkifAnybodyWon: function () {
    if (this.score.player1 == 12) {
      return 1; // Jogador 1 venceu
    } else if (this.score.player2 == 12) {
      return 2; // Jogador 2 venceu
    }
    return false; // Ninguém venceu ainda
  },

  // Função para reiniciar o jogo
  clear: function () {
    location.reload(); // Recarrega a página para recomeçar o jogo
  },

  // Função para verificar se há uma jogada de salto disponível
  check_if_jump_exist: function () {
    this.jumpexist = false;
    this.continuousjump = false;
    for (let k of pieces) {
      k.allowedtomove = false;
      // Se uma peça puder realizar um salto, define-a como permitida para mover
      if (
        k.position.length != 0 &&
        k.player == this.playerTurn &&
        k.canJumpAny()
      ) {
        this.jumpexist = true;
        k.allowedtomove = true;
      }
    }
    // Se não houver saltos, todas as peças podem se mover
    if (!this.jumpexist) {
      for (let k of pieces) k.allowedtomove = true;
    }
  },

  // Função auxiliar para possivelmente se comunicar com back-end, retornando o estado do tabuleiro como string
  str_board: function () {
    ret = "";
    for (let i in this.board) {
      for (let j in this.board[i]) {
        var found = false;
        for (let k of pieces) {
          if (k.position[0] == i && k.position[1] == j) {
            if (k.king) ret += this.board[i][j] + 2; // Adiciona 2 para identificar uma peça coroada
            else ret += this.board[i][j];
            found = true;
            break;
          }
        }
        if (!found) ret += "0"; // Casa vazia
      }
    }
    return ret;
  },
};

export { Board, pieces, tiles }; // Exporta o objeto Board, e as peças e tiles
