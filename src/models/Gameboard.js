import {
  getRandomOrientation,
  getRandomCoordinate,
  generateShipCoordinates,
} from '../utils/placeShipRandomly';

export default class Gameboard {
  static GRID_SIZE = 10;

  static shipsToPlace = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Cruiser', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Destroyer', length: 2 },
  ];

  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.allAttacks = new Set();
    this.occupiedCoordinates = new Set();
  }

  reset() {
    this.ships = [];
    this.missedAttacks = [];
    this.allAttacks = new Set();
    this.occupiedCoordinates = new Set();
  }

  // helper function  for checking if there is  a ship on a square
  isCoordinateOccupied([x, y]) {
    return this.occupiedCoordinates.has(`${x},${y}`);
  }

  placeShip(ship, coordinates) {
    // Check ship length matches coordinates
    if (coordinates.length !== ship.length) {
      throw new Error('Coordinates length must match ship length');
    }

    // Validate coordinates
    const outOfBounds = coordinates.some(
      ([x, y]) =>
        x < 0 || x >= Gameboard.GRID_SIZE || y < 0 || y >= Gameboard.GRID_SIZE,
    );
    if (outOfBounds) {
      throw new Error(
        `Coordinates out of bounds (0-${Gameboard.GRID_SIZE - 1})`,
      );
    }

    // Check for overlap
    const overlap = coordinates.some((coord) =>
      this.isCoordinateOccupied(coord),
    );
    if (overlap) {
      throw new Error('Cannot place ship on occupied space');
    }

    // Mark coordinates as occupied
    coordinates.forEach((coord) =>
      this.occupiedCoordinates.add(coord.toString()),
    );

    // Add ship to board
    this.ships.push({ ship, coordinates });
  }

  placeShipRandomly() {
    for (const { name, length } of Gameboard.shipsToPlace) {
      let placed = false;

      while (!placed) {
        const orientation = getRandomOrientation();

        // this is where the coord will start
        const startingCoordinate = getRandomCoordinate();

        // and this one is the collection of all of them
        const coordinates = generateShipCoordinates(
          startingCoordinate,
          length,
          orientation,
        );

        try {
          this.placeShip({ name, length }, coordinates);
          placed = true;
        } catch (err) {
          // Do nothing, just retry with new random coordinates
        }
      }
    }
  }

  // changed this method to return the ship not the wrapper
  _findShipAt([x, y]) {
    const wrapper = this.ships.find(({ coordinates }) =>
      coordinates.some(([cx, cy]) => cx === x && cy === y),
    );

    return wrapper ? wrapper.ship : null;
  }

  receiveAttack(coordinates) {
    // Validate input
    const [x, y] = coordinates;
    if (
      x < 0 ||
      x >= Gameboard.GRID_SIZE ||
      y < 0 ||
      y >= Gameboard.GRID_SIZE
    ) {
      throw new Error('Attack coordinates out of bounds');
    }

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
      return 'hit';
    }
    this.missedAttacks.push(coordinates);
    return 'miss';
  }

  allShipsSunk() {
    //  shipWrapper contains both ship and coordinates

    if (this.ships.length === 0) return false; // no ships placed yet
    return this.ships.every((shipWrapper) => shipWrapper.ship.isSunk());
  }
}
