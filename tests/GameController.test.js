import GameController from '../src/models/GameController';
import Gameboard from '../src/models/Gameboard';
import Player from '../src/models/Player';
import Ship from '../src/models/Ship';

describe('GameController', () => {
  let game;
  let human;
  let computer;

  beforeEach(() => {
    const humanBoard = new Gameboard();
    const computerBoard = new Gameboard();

    // Add ships
    const destroyer = new Ship(3);
    computerBoard.placeShip(destroyer, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    human = new Player('human', humanBoard);
    computer = new Player('computer', computerBoard);

    game = new GameController(human, computer);
  });

  test.only('initializes with two players', () => {
    expect(game.player).toBeDefined();
    expect(game.computer).toBeDefined();
  });

  test.only('starts with player turn', () => {
    expect(game.getCurrentPlayer()).toBe(human);
  });

  test.only('player can attack enemy board', () => {
    const result = game.playerAttack([0, 0]);

    expect(['hit', 'miss']).toContain(result);
  });

  test.only('turn switches after player attack', () => {
    game.playerAttack([0, 0]);
    expect(game.getCurrentPlayer()).toBe(game.computer);
  });

  test.only('throws error when attacking same coordinate twice', () => {
    game.playerAttack([1, 1]);

    expect(() => {
      game.playerAttack([1, 1]);
    }).toThrow('already attacked');
  });

  test('computer makes a legal move', () => {
    game.playerAttack([0, 0]); // switch to computer

    const move = game.computerAttack();

    expect(move).toHaveProperty('coordinates');
    expect(['hit', 'miss']).toContain(move.result);
  });

  test('game ends when all ships of a player are sunk', () => {
    // fake-sink all computer ships
    game.computer.gameboard.ships.forEach(({ ship }) => {
      while (!ship.isSunk()) {
        ship.hit();
      }
    });

    expect(game.isGameOver()).toBe(true);
    expect(game.getWinner()).toBe('player');
  });
});
