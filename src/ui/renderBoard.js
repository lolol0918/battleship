export default function renderBoard(container, gameboard, options = {}) {
  const { showShips = true } = options;
  const board = container; // local reference ✅

  board.innerHTML = '';

  const fragment = document.createDocumentFragment();

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (showShips && gameboard.isCoordinateOccupied([x, y])) {
        cell.classList.add('has-ship');
      }

      fragment.appendChild(cell);
    }
  }

  board.appendChild(fragment);
}



