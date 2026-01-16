// tests/Gameboard.test.js
import Gameboard from '../src/models/Gameboard';
import Ship from '../src/models/Ship';
import 'regenerator-runtime/runtime';

describe('Gameboard', () => {
  let board;
  let destroyer;

  beforeEach(() => {
    board = new Gameboard();
    destroyer = new Ship(3);
  });

  test('can place a ship with correct coordinates', () => {
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    board.placeShip(destroyer, coordinates);

    // Check that the ship is stored with correct coordinates
    expect(board.ships.length).toBe(1);
    expect(board.ships[0].ship).toBe(destroyer);
    expect(board.ships[0].coordinates).toEqual(coordinates);
  });

  test("throws error if coordinates length doesn't match ship length", () => {
    const wrongCoordinates = [
      [1, 0],
      [1, 1],
    ];
    expect(() => board.placeShip(destroyer, wrongCoordinates)).toThrow(
      'Coordinates length must match ship length',
    );
  });

  test('registers a hit when attacking a ship coordinate', () => {
    const coordinates = [
      [1, 1],
      [1, 2],
      [1, 3],
    ];
    board.placeShip(destroyer, coordinates);

    const result = board.receiveAttack([1, 1]);
    expect(result).toBe('hit');

    // Ship should not be sunk yet
    expect(destroyer.isSunk()).toBe(false);
  });

  test('records a missed attack', () => {
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    board.placeShip(destroyer, coordinates);

    const result = board.receiveAttack([1, 1]);
    expect(result).toBe('miss');
    expect(board.missedAttacks).toContainEqual([1, 1]);
  });

  test('reports true when all ships are sunk', () => {
    const coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    board.placeShip(destroyer, coordinates);

    // Attack all coordinates of the ship
    coordinates.forEach((coord) => board.receiveAttack(coord));

    expect(board.allShipsSunk()).toBe(true);
  });

  test('reports false if at least one ship is not sunk', () => {
    const cruiser = new Ship(2);
    board.placeShip(destroyer, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    board.placeShip(cruiser, [
      [1, 0],
      [1, 1],
    ]);

    // Only sink destroyer
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);

    expect(board.allShipsSunk()).toBe(false);
  });

  test('cannot count a hit multiple times on the same coordinate', () => {
    board.placeShip(destroyer, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 0]); // repeated attack

    // Destroyer should have only 1 hit counted
    expect(destroyer.isSunk()).toBe(false);
    expect(destroyer.hits).toBe(1); // assuming hits is accessible for testing
  });
});

describe('Gameboard reset', () => {
  let board;
  let ship;

  beforeEach(() => {
    board = new Gameboard();
    ship = new Ship(3);
    board.placeShip(ship, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    board.receiveAttack([0, 0]);
    board.receiveAttack([5, 5]); // missed attack
  });

  test('reset clears ships', () => {
    board.reset();
    expect(board.ships.length).toBe(0);
  });

  test('reset clears missed attacks', () => {
    board.reset();
    expect(board.missedAttacks.length).toBe(0);
  });

  test('reset clears all attacks', () => {
    board.reset();
    expect(board.allAttacks.size).toBe(0);
  });

  test('after reset, can place ships again', () => {
    board.reset();
    const newShip = new Ship(2);
    board.placeShip(newShip, [
      [1, 0],
      [1, 1],
    ]);
    expect(board.ships.length).toBe(1);
    expect(board.ships[0].ship).toBe(newShip);
  });
});

describe('Gameboard random ship placement', () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test('places all ships randomly without overlap', () => {
    board.placeShipRandomly();

    // All ships are placed
    expect(board.ships.length).toBe(Gameboard.shipsToPlace.length);

    // No overlapping coordinates
    const allCoords = new Set();
    for (const { coordinates } of board.ships) {
      for (const [x, y] of coordinates) {
        const key = `${x},${y}`;
        expect(allCoords.has(key)).toBe(false); // no duplicates
        allCoords.add(key);
      }
    }

    // All coordinates are in bounds
    for (const { coordinates } of board.ships) {
      for (const [x, y] of coordinates) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(Gameboard.GRID_SIZE);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThan(Gameboard.GRID_SIZE);
      }
    }
  });
});
