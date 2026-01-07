import Gameboard from './Gameboard';

export default class Player {
  constructor(name, type = 'human') {
    this.name = name;
    this.type = type; // 'human' or 'computer'
    this.gameboard = new Gameboard();
  }
}
