import { GameController } from "./GameController.js";

export class ScreenController {
  #game;
  #playerOneDiv;
  #playerTwoDiv; // currently player two is a computer;

  constructor() {
    this.#game = new GameController();

    this.#playerOneDiv = document.querySelector("#player-one-board");
    this.#playerTwoDiv = document.querySelector("#player-two-board");

    this.updateScreen();
  }

  updateScreen() {
    this.#playerOneDiv.textContent = "";
    this.#playerTwoDiv.textContent = "";

    this.#renderBoard(
      this.#game.boardOne,
      this.#playerOneDiv,
      this.#game.isPlayerOneTurn() ? true : false,
    );
    this.#renderBoard(
      this.#game.boardTwo,
      this.#playerTwoDiv,
      this.#game.isPlayerTwoTurn() ? true : false,
    );
  }

  #renderBoard(boardData, boardDiv, showShips) {
    for (let y = 1; y <= 10; y++) {
      for (let xCode = 65; xCode <= 74; xCode++) {
        const x = String.fromCharCode(xCode);
        const coordinate = `${x}${y}`;

        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.dataset.x = x;
        cell.dataset.y = y;

        if (boardData.coordinates.has(coordinate) && showShips) {
          cell.classList.add("ship");
        }

        if (boardData.attackedCoordinates.has(coordinate)) {
          if (boardData.coordinates.has(coordinate)) {
            cell.classList.add("hit");
          } else {
            cell.classList.add("miss");
          }
        }

        if (!showShips) {
          cell.addEventListener("click", () => {
            this.#game.playRound(x, y);
            this.updateScreen();
          });
        }

        boardDiv.appendChild(cell);
      }
    }
  }
}
