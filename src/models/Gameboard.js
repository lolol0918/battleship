export default class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.successfulAttacks = [];
    this.allAttacks = new Set();
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

  _findShipAt([x, y]) {
    return this.ships.find(({ ship, coordinates }) =>
      coordinates.some(([cx, cy]) => cx === x && cy === y),
    );
  }

  receiveAttack(coordinates) {
    const coordString = coordinates.toString();

    if (this.allAttacks.has(coordString)) {
      return 'already attacked';
    }

    // marked as attacked
    this.allAttacks.add(coordString);

    const target = this._findShipAt(coordinates);

    // I return hit or miss values to satisfy the test
    if (target) {
      target.ship.hit();
      this.successfulAttacks.push(coordinates);
      return 'hit';
    }
    this.missedAttacks.push(coordinates);
    return 'miss';
  }

  allShipsSunk() {
    //  shipWrapper contains both ship and coordinates

    return this.ships.every((shipWrapper) => shipWrapper.ship.isSunk());
  }
}
