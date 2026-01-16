export function getRandomOrientation() {
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}

export function getRandomCoordinate(boardSize = 10) {
  const x = Math.floor(Math.random() * boardSize);
  const y = Math.floor(Math.random() * boardSize);
  return [x, y];
}

export function generateShipCoordinates(start, length, orientation) {
  const [x, y] = start;
  const coordinates = [];

  for (let i = 0; i < length; i += 1) {
    if (orientation === 'horizontal') {
      coordinates.push([x + i, y]);
    } else {
      coordinates.push([x, y + i]);
    }
  }

  return coordinates;
}
