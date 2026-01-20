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
    this.wireEvents();
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

  // eslint-disable-next-line class-methods-use-this
  updateCell(cell, result, showShip = false) {
    // Remove previous classes
    cell.classList.remove('hit', 'miss', 'has-ship');

    if (result === 'hit') {
      cell.classList.add('hit');
    } else if (result === 'miss') {
      cell.classList.add('miss');
    }

    // Optionally show ship (for player's own board)
    if (showShip && result === 'ship') {
      cell.classList.add('has-ship');
    }
  }

  handlePlayerAttack(cell) {
    if (this.gameController.getCurrentPlayer() !== this.player) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    // check if already attacked
    if (
      this.gameController.computer.gameboard.allAttacks.has([x, y].toString())
    ) {
      return; // ignore click
    }

    const result = this.gameController.playerAttack([x, y]);
    this.updateCell(cell, result);

    if (!this.gameController.isGameOver()) {
      // Trigger computer turn after slight delay for UX
      setTimeout(() => this.computerMove(), 0);
    } else {
      this.endGame(this.gameController.getWinner());
    }
  }

  endGame(winner) {
    this.gameOver = true;

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Add victory or defeat class
    const isVictory = winner === 'Player';
    if (isVictory) {
      modalContent.classList.add('victory');
    } else {
      modalContent.classList.add('defeat');
    }

    // Modal HTML
    modalContent.innerHTML = `
    <h2>${isVictory ? 'Victory!' : 'Defeat!'}</h2>
    <span class="modal-emoji">${isVictory ? '🎉' : '💀'}</span>
    <p>${isVictory ? 'You sunk all enemy ships!' : 'Your fleet has been destroyed!'}</p>
    <button class="restart-btn">Play Again</button>
  `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Restart button event
    const restartBtn = modalContent.querySelector('.restart-btn');
    restartBtn.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    });

    // Disable all clicks on enemy board
    const enemyCells = this.enemyBoardContainer.querySelectorAll('.cell');
    enemyCells.forEach((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style.cursor = 'not-allowed';
      // eslint-disable-next-line no-param-reassign
      cell.style.pointerEvents = 'none';
    });
  }

  // Remove the old showPlayAgainButton method - you don't need it anymore

  computerMove() {
    const move = this.gameController.computerAttack();
    const { coordinates, result } = move;

    const cell = this.playerContainer.querySelector(
      `[data-x='${coordinates[0]}'][data-y='${coordinates[1]}']`,
    );
    this.updateCell(cell, result);

    if (this.gameController.isGameOver()) {
      this.endGame();
    }
  }

  wireEvents() {
    // Player attacking computer board
    this.computerContainer.querySelectorAll('.cell').forEach((cell) => {
      cell.addEventListener('click', () => this.handlePlayerAttack(cell));
    });
  }
}
