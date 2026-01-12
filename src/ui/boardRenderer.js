function renderBoard(elementId, gameboard) {
  const board = document.getElementById(elementId);
  board.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;

      // Check if ship here, add CSS class
      if (gameboard.isCoordinateOccupied([x, y])) {
        cell.classList.add('has-ship');
      }

      board.appendChild(cell);
    }
  }
}

export default renderBoard;
