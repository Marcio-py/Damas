// Imports
import { Board, pieces, tiles } from './components/Board.js';


window.onload = function () {
  //inicializar a placa
  initializedBoard = Board.initalize();

  /***
  Events
  ***/

  //selecione a peça ao clicar se for a vez do jogador
  $('.piece').on("click", function () {
    var selected;
    var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
    if (isPlayersTurn) {
      if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
        if ($(this).hasClass('selected')) selected = true;
        $('.piece').each(function (index) {
          $('.piece').eq(index).removeClass('selected')
        });
        if (!selected) {
          $(this).addClass('selected');
        }
      } else {
        let exist = "jump exist for other pieces, that piece is not allowed to move"
        let continuous = "continuous jump exist, you have to jump the same piece"
        let message = !Board.continuousjump ? exist : continuous
        console.log(message)
      }
    }
  });

  //reinicia o jogo quando o botão limpar é pressionado
  $('#cleargame').on("click", function () {
    Board.clear();
  });

  //mova a peça quando o title for clicado
  $('.tile').on("click", function () {
    //certifique-se de que uma peça esteja selecionada
    if ($('.selected').length != 0) {
      //encontra o objeto de bloco title que está sendo clicado
      var tileID = $(this).attr("id").replace(/tile/, '');
      var tile = tiles[tileID];
      //encontra a peça que está sendo selecionada
      var piece = pieces[$('.selected').attr("id")];
      //verifique se o title está no alcance da peça selecionada
      var inRange = tile.inRange(piece);
      if (inRange != 'wrong') {
        // Verifica se há pulos disponíveis, se houver, o jogador deve pular(caraterística obrigatória)
        if (inRange == 'jump') {
          if (piece.opponentJump(tile)) {
            piece.move(tile);
            if (piece.canJumpAny()) {
              // Board.changePlayerTurn(); //voltar ao original já que outra volta pode ser feita
              piece.element.addClass('selected');
             // existe salto/captura contínuo, você não tem permissão para desmarcar esta peça ou selecionar outras peças
              Board.continuousjump = true;
            } else {
              Board.changePlayerTurn()
            }
          }
          //se for regular, mova-o se não houver salto disponível
        } else if (inRange == 'regular' && !Board.jumpexist) {
          if (!piece.canJumpAny()) {
            piece.move(tile);
            Board.changePlayerTurn()
          } else {
            alert("You must jump when possible!");
          }
        }
      }
    }
  });
}

export var initializedBoard;