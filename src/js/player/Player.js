export class Player {
  #movePool = [];
  #type = "COMPUTER";
  #allowedType = ["COMPUTER", "PLAYER"];

  constructor(type) {
    if (this.#allowedType.includes(type)) {
      this.#type = type;
    } else {
      throw new Error("Player type are either COMPUTER or PLAYER");
    }

    if (this.#type === "COMPUTER") {
      this.#initializeMovePool();
    }
  }

  #initializeMovePool() {
    for (let i = 0; i < 10; i++) {
      const letter = String.fromCharCode(65 + i);
      for (let j = 1; j <= 10; j++) {
        this.#movePool.push(`${letter}${j}`);
      }
    }
  }

  getComputerMove() {
    const randomIndex = Math.floor(Math.random() * this.#movePool.length);

    const move = this.#movePool.splice(randomIndex, 1)[0];

    return move;
  }
}
