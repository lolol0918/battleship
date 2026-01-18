import './style.css';
import Gameboard from './models/Gameboard.js';
import PlacementPhase from './ui/placementPhase.js';

const playerGameboard = new Gameboard();
const { shipsToPlace } = Gameboard;

// store the instance even if you don’t use it immediately
// eslint-disable-next-line no-unused-vars
const placementPhase = new PlacementPhase(
  playerGameboard,
  'placement-board',
  shipsToPlace,
);
