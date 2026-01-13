export default class GameController {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.currentTurn = this.player;
  }

  switchTurn() {
    this.currentTurn =
      this.currentTurn === this.player ? this.computer : this.player;
  }

  getCurrentPlayer() {
    return this.currentTurn;
  }

  playerAttack(coordinates) {
    const result = this.computer.gameboard.receiveAttack(coordinates);
    this.switchTurn();

    return result;
  }
}
