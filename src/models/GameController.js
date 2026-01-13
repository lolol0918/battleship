export default class GameController {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.currentTurn = this.player;
  }
}
