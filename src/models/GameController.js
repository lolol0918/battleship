export default class GameController {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.currentTurn = this.player;
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
    const result = this.computer.gameboard.receiveAttack(coordinates);

    if (result === 'already attacked') throw new Error('already attacked');

    this.switchTurn();

    return result;
  }
}
