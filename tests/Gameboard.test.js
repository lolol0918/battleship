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
