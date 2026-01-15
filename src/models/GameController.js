import Ship from './Ship';

export default class GameController {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.currentTurn = this.player;
    this.hasStarted = false;
  }

  startGame() {
    // reset the player's board
    this.player.gameboard.reset();
    this.computer.gameboard.reset();

    // Populate ships (hardcoded for now)
    this.player.gameboard.placeShip(new Ship(5), [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ]); // example
    this.computer.gameboard.placeShip(new Ship(5), [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ]); // example

    this.currentTurn = this.player;
    this.hasStarted = true;
  }

  switchTurn() {
    this.currentTurn =
      this.currentTurn === this.player ? this.computer : this.player;

    return this.currentTurn;
  }

  getCurrentPlayer() {
    return this.currentTurn;
  }

  playerAttack(coordinates) {
    if (!this.hasStarted) {
      throw new Error('Game not started');
    }

    if (this.currentTurn !== this.player) {
      throw new Error("Not player's turn");
    }

    const result = this.computer.gameboard.receiveAttack(coordinates);

    if (result === 'already attacked') throw new Error('already attacked');

    this.switchTurn();

    return result;
  }

  computerAttack() {
    if (this.currentTurn !== this.computer)
      throw new Error("Not computer's turn");

    let x;
    let y;
    let coord;

    // pick random untried coordinate
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      coord = [x, y];
    } while (this.player.gameboard.allAttacks.has(coord.toString()));

    const result = this.player.gameboard.receiveAttack(coord);

    this.switchTurn(); // back to human
    return { coordinates: coord, result };
  }

  isGameOver() {
    return (
      this.player.gameboard.allShipsSunk() ||
      this.computer.gameboard.allShipsSunk()
    );
  }

  getWinner() {
    if (!this.isGameOver()) return null;

    if (this.player.gameboard.allShipsSunk()) return this.computer.name;
    if (this.computer.gameboard.allShipsSunk()) return this.player.name;

    return null;
  }
}
