import './style.css';
import Gameboard from './models/Gameboard.js';
import renderBoard from './ui/renderBoard.js';

const playerGameboard = new Gameboard();

document.addEventListener('DOMContentLoaded', () => {
  const placementBoard = document.getElementById('placement-board');
  renderBoard(placementBoard, playerGameboard);
});