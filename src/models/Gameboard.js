export default class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  // helper function  for checking if there is  a ship on a square
  isCoordinateOccupied([x, y]) {
    for (const { coordinates } of this.ships) {
      for (const [cx, cy] of coordinates) {
        if (cx === x && cy === y) return true;
      }
    }

    return false;
  }

  placeShip(ship, coordinates) {
    if (coordinates.length !== ship.length) {
      throw new Error('Coordinates length must match ship length');
    }

    for (const coord of coordinates) {
      if (this.isCoordinateOccupied(coord)) {
        throw new Error('Cannot place ship on occupied space');
      }
    }

    this.ships.push({ ship, coordinates });
  }
}
