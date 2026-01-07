export default class Ship {
  constructor(length) {
    if (length <= 0) throw new Error('length must be positive');
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.isSunk()) return;

    if (this.hits < this.length) {
      this.hits += 1;
    }
  }

  isSunk() {
    return this.sunk || this.hits >= this.length;
  }
}
