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

    human = new Player('human', humanBoard);
    computer = new Player('computer', computerBoard);

    game = new GameController(human, computer);

    // Reset and populate boards
    game.startGame();
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

    // set turn back to player to test repeated attack
    game.currentTurn = game.player;

    expect(() => {
      game.playerAttack([1, 1]);
    }).toThrow('already attacked');
  });

  test.only('computer makes a legal move', () => {
    game.playerAttack([0, 0]); // switch to computer

    const move = game.computerAttack();

    expect(move).toHaveProperty('coordinates');
    expect(['hit', 'miss']).toContain(move.result);
  });

  test.only('game ends when all ships of a player are sunk', () => {
    // fake-sink all computer ships
    game.computer.gameboard.ships.forEach(({ ship }) => {
      while (!ship.isSunk()) {
        ship.hit();
      }
    });

    expect(game.isGameOver()).toBe(true);
    expect(game.getWinner()).toBe('human');
  });

  test.only('startGame resets boards and sets current turn', () => {
    const humanBoard = new Gameboard();
    const computerBoard = new Gameboard();

    // Add dummy ships to show reset works
    const destroyer = new Ship(3);
    computerBoard.placeShip(destroyer, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    humanBoard.placeShip(new Ship(2), [
      [1, 0],
      [1, 1],
    ]);

    game.startGame();

    // After startGame, boards should be reset
    expect(human.gameboard.ships.length).toBeGreaterThan(0); // new ships placed
    expect(computer.gameboard.ships.length).toBeGreaterThan(0);

    // Game should be marked started
    expect(game.hasStarted).toBe(true);

    // Current turn should be human
    expect(game.getCurrentPlayer()).toBe(human);
  });
});
