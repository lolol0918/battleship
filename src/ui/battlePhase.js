import renderBoard from './renderBoard.js';

export default class BattlePhase {
  constructor(player, computer, gameController) {
    this.player = player;
    this.computer = computer;
    this.gameController = gameController;
  }

  init() {
    this.playerContainer = document.getElementById('player-board'); // div for player board
    this.computerContainer = document.getElementById('enemy-board'); // div for computer board

    this.renderBoards();
  }

  renderBoards() {
    this.renderComputerBoard();
    this.renderPlayerBoard();
  }

  renderPlayerBoard() {
    // Use your renderBoard util
    renderBoard(this.playerContainer, this.player.gameboard, {
      showShips: true,
    });
  }

  renderComputerBoard() {
    // Hide ships for the computer
    renderBoard(this.computerContainer, this.computer.gameboard, {
      showShips: false,
    });
  }
}
