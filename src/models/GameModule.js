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
    // Hide placement, show battle
    document.getElementById('placement-phase').classList.add('hidden');
    document.getElementById('battle-phase').classList.remove('hidden');

    // Randomize computer ships now
    this.computerBoard.placeShipsRandomly();

    // Create GameController with fully populated boards
    this.gameController = new GameController(
      { name: 'Player', gameboard: this.playerBoard },
      { name: 'Computer', gameboard: this.computerBoard },
    );

    this.gameController.startGame();

    // Initialize BattlePhase
    this.battlePhase = new BattlePhase(
      this.gameController.player,
      this.gameController.computer,
      this.gameController,
    );

    this.battlePhase.init();
  }
}
