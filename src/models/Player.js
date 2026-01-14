export default class Player {
  constructor(name, gameboard, type = 'human') {
    this.name = name;
    this.type = type; // 'human' or 'computer'
    this.gameboard = gameboard; // assign the board here
  }
}
