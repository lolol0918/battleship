import Gameboard from './Gameboard.js';
import GameController from './GameController.js';
import PlacementPhase from '../ui/placementPhase.js';
import BattlePhase from '../ui/battlePhase.js';

export default class GameModule {
  constructor() {
    this.playerBoard = new Gameboard();
    this.computerBoard = new Gameboard();
    this.gameController = null;

    this.placementPhase = new PlacementPhase(
      this.playerBoard,
      'placement-board',
    );

    this.placementPhase.onFinish = () => this.startBattle();
  }

  startBattle() {
    document.getElementById('placement-phase').classList.add('hidden');
    document.getElementById('battle-phase').classList.remove('hidden');

    // create GameController after placement
    this.gameController = new GameController(
      this.playerBoard,
      this.computerBoard,
    );

    this.battlePhase = new BattlePhase(
      this.gameController.player,
      this.gameController.computer,
      this.gameController,
    );

    this.battlePhase.init();
  }
}
