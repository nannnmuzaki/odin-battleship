import { Player } from "../player/Player.js";
import { Gameboard } from "../gameboard/Gameboard.js";

export class GameController {
  #playerOne;
  #playerTwo;
  #boardOne;
  #boardTwo;
  #activePlayer;
  #winner;

  constructor() {
    this.#playerOne = new Player("PLAYER");
    this.#playerTwo = new Player("COMPUTER");

    this.#boardOne = new Gameboard();
    this.#boardTwo = new Gameboard();

    // For now both use random ship placement
    this.#initializeRandomBoard(this.#boardOne);
    this.#initializeRandomBoard(this.#boardTwo);

    // Player One always starts first, maybe will be random later
    this.#activePlayer = this.#playerOne;
    // this.#activePlayer =
    //   Math.floor(Math.round()) > 0 ? this.#playerOne : this.#playerTwo;
  }

  get boardOne() {
    return this.#boardOne;
  }

  get boardTwo() {
    return this.#boardTwo;
  }

  get activePlayer() {
    return this.#activePlayer;
  }

  isPlayerOneTurn() {
    return this.#activePlayer === this.#playerOne;
  }

  isPlayerTwoTurn() {
    return this.#activePlayer === this.#playerTwo;
  }

  get isPlayerTwoComputer() {
    return this.#playerTwo.isPlayerComputer();
  }

  #switchPlayerTurn() {
    this.#activePlayer =
      this.#activePlayer === this.#playerOne
        ? this.#playerTwo
        : this.#playerOne;
  }

  playRound(x, y) {
    // 1. Send the attack to the correct board
    try {
      if (this.#activePlayer === this.#playerOne) {
        this.#boardTwo.receiveAttack(x, y);
        console.log(`Player One attacks ${x}${y}`);
      } else {
        this.#boardOne.receiveAttack(x, y);
        console.log(`Player Two attacks ${x}${y}`);
      }
    } catch (err) {
      console.log(err.message);
      return;
    }

    // 2. Check for a winner
    if (this.#boardOne.areAllShipsSunk()) {
      this.#winner = this.#playerTwo;
      console.log("Player Two Win");
      return this.#winner;
    } else if (this.#boardTwo.areAllShipsSunk()) {
      this.#winner = this.#playerOne;
      console.log("Player One Win");
      return this.#winner;
    }

    // 3. Switch turns
    this.#switchPlayerTurn();
  }

  playComputerTurn() {
    if (!this.#activePlayer.isPlayerComputer()) return;

    const move = this.#activePlayer.getComputerMove();
    const x = move[0];
    const y = parseInt(move.slice(1), 10);

    this.playRound(x, y);
  }

  #initializeRandomBoard(board) {
    if (!(board instanceof Gameboard)) {
      throw new TypeError("board must be a type of Gameboard");
    }

    const shipLengths = [5, 4, 3, 3, 2];
    const orientations = ["HORIZONTAL", "VERTICAL"];

    for (const length of shipLengths) {
      let placed = false;

      while (!placed) {
        const randomXCode = Math.floor(Math.random() * 10) + 65;
        const x = String.fromCharCode(randomXCode);

        const y = Math.floor(Math.random() * 10) + 1;

        const orientation = orientations[Math.round(Math.random())];

        try {
          board.placeShip(x, y, orientation, length);
          placed = true;
        } catch {
          // do nothing,
          // since the error from brute forcing placement is not important
        }
      }
    }
  }

  get winner() {
    return this.#winner;
  }
}
