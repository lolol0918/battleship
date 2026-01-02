import Ship from '../src/models/Ship.js';
describe('Ship', () => {
  test('creates a ship with the correct length', () => {
    const ship = new Ship(4);
    expect(ship.length).toBe(4);
  });

  test('is not sunk initially', () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
  });

  test('hit() increments hits but does not sink early', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('sinks after receiving enough hits', () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
