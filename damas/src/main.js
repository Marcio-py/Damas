// Imports
import { Board, pieces, tiles } from './components/Board.js';

// Executa quando a página é carregada
window.onload = function () {
  // Inicializa o tabuleiro
  initializedBoard = Board.initalize();

  /***
   Eventos
  ***/

  // Seleciona a peça quando clicada, se for a vez do jogador
  $('.piece').on("click", function () {
    var selected;
    // Verifica se a peça pertence ao jogador atual
    var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");

    if (isPlayersTurn) {
      // Verifica se não há um salto contínuo obrigatório e se a peça está permitida a mover
      if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
        // Verifica se a peça já está selecionada
        if ($(this).hasClass('selected')) selected = true;
        
        // Remove a seleção de todas as peças
        $('.piece').each(function (index) {
          $('.piece').eq(index).removeClass('selected');
        });

        // Se a peça não estava selecionada, adiciona a seleção
        if (!selected) {
          $(this).addClass('selected');
        }
      } else {
        // Se existe um salto obrigatório ou contínuo, mostra mensagem apropriada
        let exist = "jump exist for other pieces, that piece is not allowed to move";
        let continuous = "continuous jump exist, you have to jump the same piece";
        let message = !Board.continuousjump ? exist : continuous;
        console.log(message);
      }
    }
  });

  // Reinicia o jogo quando o botão "limpar" é pressionado
  $('#cleargame').on("click", function () {
    Board.clear(); // Limpa o tabuleiro e reinicia o estado do jogo
  });

  // Move a peça quando um tile (casa) é clicado
  $('.tile').on("click", function () {
    // Verifica se uma peça está selecionada
    if ($('.selected').length != 0) {
      // Encontra o objeto tile correspondente ao bloco clicado
      var tileID = $(this).attr("id").replace(/tile/, ''); // Remove a parte "tile" do ID para obter a posição
      var tile = tiles[tileID]; // Obtém o objeto tile

      // Encontra a peça que está selecionada
      var piece = pieces[$('.selected').attr("id")];

      // Verifica se o tile está ao alcance da peça selecionada
      var inRange = tile.inRange(piece);

      if (inRange != 'wrong') {
        // Se a jogada for um salto, o jogador deve pular (movimento obrigatório)
        if (inRange == 'jump') {
          // Realiza o salto sobre uma peça oponente
          if (piece.opponentJump(tile)) {
            piece.move(tile); // Move a peça para o tile

            // Verifica se a peça pode continuar a saltar
            if (piece.canJumpAny()) {
              piece.element.addClass('selected'); // Mantém a peça selecionada para novo salto
              Board.continuousjump = true; // Indica que há um salto contínuo obrigatório
            } else {
              Board.changePlayerTurn(); // Troca a vez do jogador
            }
          }
        // Se for um movimento regular, e não houver saltos disponíveis
        } else if (inRange == 'regular' && !Board.jumpexist) {
          // Verifica se a peça pode saltar, se não, permite o movimento regular
          if (!piece.canJumpAny()) {
            piece.move(tile); // Move a peça para o tile
            Board.changePlayerTurn(); // Troca a vez do jogador
          } else {
            alert("You must jump when possible!"); // Exibe alerta caso o salto seja obrigatório
          }
        }
      }
    }
  });
}

// Exporta a variável initializedBoard para uso em outros módulos
export var initializedBoard;
