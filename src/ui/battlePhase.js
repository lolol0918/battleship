import renderBoard from './renderBoard.js';

export default class BattlePhase {
  constructor(player, computer, gameController) {
    this.player = player;
    this.computer = computer;
    this.gameController = gameController;

    this.playerContainer = document.getElementById('player-board'); // div for player board
    this.computerContainer = document.getElementById('computer-board'); // div for computer board
  }

  init() {
    this.renderBoards();
  }

  renderBoards() {
    this.renderComputerBoard();
    this.renderPlayerBoard();
  }

  renderPlayerBoard() {
    // Use your renderBoard util
    renderBoard(this.playerContainer, this.playerBoard, { showShips: true });
  }

  renderComputerBoard() {
    // Hide ships for the computer
    renderBoard(this.computerContainer, this.computerBoard, {
      showShips: false,
    });
  }
}
