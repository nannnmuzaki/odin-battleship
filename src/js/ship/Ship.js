export class Ship {
  #length = 0;
  #hits = 0;

  constructor(length) {
    this.#length = length;
  }

  hit() {
    if (this.#hits >= this.#length) {
      throw new Error("this ship is already sunked");
    } else {
      this.#hits++;
    }
  }

  isSunk() {
    return this.#hits === this.#length;
  }
}
