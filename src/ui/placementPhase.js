import renderBoard from './renderBoard.js';

export default class PlacementPhase {
  constructor(playerBoard, containerId, shipData) {
    this.playerBoard = playerBoard;
    this.container = document.getElementById(containerId);
    this.shipData = shipData; // array of ships
    this.availableShips = [...shipData];
    this.orientation = 'horizontal';
    this.currentShip = null;

    this.initUI();
  }

  initUI() {
    this.renderShipPalette();
    this.renderBoard();
    this.setupRotateButton();
    this.setupRandomizeButton();
  }

  renderBoard() {
    renderBoard(this.container, this.playerBoard, { showShips: true });
  }

  renderShipPalette() {
    const palette = document.getElementById('ship-palette');
    palette.innerHTML = '';
    this.availableShips.forEach((ship) => {
      const div = document.createElement('div');
      div.classList.add('draggable-ship');
      div.draggable = true;
      div.dataset.shipName = ship.name;
      div.dataset.length = ship.length;
      div.textContent = `${ship.name} (${ship.length})`;

      div.addEventListener('dragstart', () => {
        this.currentShip = { name: ship.name, length: ship.length };
      });

      palette.appendChild(div);
    });

    // board drag/drop
    this.container.addEventListener('dragover', (e) => e.preventDefault());
    this.container.addEventListener('drop', (e) => this.handleDrop(e));
  }

  handleDrop(e) {
    if (!this.currentShip) return;

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);

    const coords = [];
    for (let i = 0; i < this.currentShip.length; i++) {
      coords.push(this.orientation === 'horizontal' ? [x + i, y] : [x, y + i]);
    }

    try {
      this.playerBoard.placeShip(this.currentShip, coords);

      // remove ship from availableShips
      this.availableShips = this.availableShips.filter(
        (ship) => ship.name !== this.currentShip.name,
      );

      this.currentShip = null;

      this.renderBoard();
      this.renderShipPalette();
    } catch (err) {
      /* empty */
    }
  }

  setupRotateButton() {
    const rotateBtn = document.getElementById('rotate-btn');
    const orientationLabel = document.getElementById('orientation');

    rotateBtn.addEventListener('click', () => {
      this.orientation =
        this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
      orientationLabel.textContent = this.orientation;
    });
  }

  setupRandomizeButton() {
    const randomBtn = document.getElementById('randomize-btn');
    randomBtn.addEventListener('click', () => {
      this.playerBoard.placeShipsRandomly();
      this.renderBoard();
    });
  }
}
