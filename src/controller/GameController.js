import { Player } from "./Player.js";
import { Gameboard } from "./Gameboard.js";

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

    // Player One always starts first, maybe will be random later
    this.#activePlayer = this.#playerOne;
  }

  getActivePlayer() {
    return this.#activePlayer;
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

    // 4. If next active player is a computer, get a computer move and play the play the round
    if (this.#activePlayer.isPlayerComputer()) {
      const move = this.#activePlayer.getComputerMove();

      const x = move[0];
      const y = parseInt(move.slice(1), 10);

      this.playRound(x, y);
    }
  }
}
