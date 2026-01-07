export default class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
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
    // Add this:
    for (const [x, y] of coordinates) {
      if (x < 0 || x > 9 || y < 0 || y > 9) {
        throw new Error('Coordinates out of bounds (0-9 only)');
      }
    }
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

  // changed this method to return the ship not the wrapper
  _findShipAt([x, y]) {
    const wrapper = this.ships.find(({ coordinates }) =>
      coordinates.some(([cx, cy]) => cx === x && cy === y),
    );

    return wrapper ? wrapper.ship : null;
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
      target.hit();
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
