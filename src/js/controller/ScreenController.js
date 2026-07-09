import { GameController } from "./GameController.js";

export class ScreenController {
  #game;
  #contentDiv;
  #turnDisplay;
  #playerOneDiv;
  #playerTwoDiv; // currently player two is a computer;

  constructor() {
    this.#game = new GameController();
    this.#contentDiv = document.querySelector("#content");
    this.#initializeUI();
    this.updateScreen();
  }

  #initializeUI() {
    this.#contentDiv.textContent = "";

    const title = document.createElement("h1");
    title.textContent = "BATTLESHIP";

    this.#turnDisplay = document.createElement("h2");
    this.#turnDisplay.id = "turn-display";

    const boardsContainer = document.createElement("div");
    boardsContainer.classList.add("boards-container");

    const playerOneWrapper = document.createElement("div");
    const p1Label = document.createElement("h3");
    p1Label.textContent = "Friendly Fleet";
    this.#playerOneDiv = document.createElement("div");
    this.#playerOneDiv.classList.add("board");

    playerOneWrapper.appendChild(p1Label);
    playerOneWrapper.appendChild(this.#playerOneDiv);

    const playerTwoWrapper = document.createElement("div");
    const p2Label = document.createElement("h3");
    p2Label.textContent = "Enemy Waters";
    this.#playerTwoDiv = document.createElement("div");
    this.#playerTwoDiv.classList.add("board");

    playerTwoWrapper.appendChild(p2Label);
    playerTwoWrapper.appendChild(this.#playerTwoDiv);

    boardsContainer.appendChild(playerOneWrapper);
    boardsContainer.appendChild(playerTwoWrapper);

    this.#contentDiv.appendChild(title);
    this.#contentDiv.appendChild(this.#turnDisplay);
    this.#contentDiv.appendChild(boardsContainer);
  }

  updateScreen() {
    this.#playerOneDiv.textContent = "";
    this.#playerTwoDiv.textContent = "";

    const showBoardOne = this.#game.isPlayerOneTurn();

    if (this.#game.winner) {
      this.#turnDisplay.textContent = `${this.#game.winner.name} Wins!`;

      // Render both boards with showShips = true.
      // Because showShips is true, !showShips is false, so NO click listeners are attached.
      // The board is completely locked!
      this.#renderBoard(this.#game.boardOne, this.#playerOneDiv, true);
      this.#renderBoard(this.#game.boardTwo, this.#playerTwoDiv, true);

      return;
    }

    this.#turnDisplay.textContent = this.#game.isPlayerOneTurn()
      ? "Friendly Fleet's Turn"
      : "Enemy's Turn";

    const showBoardTwo = this.#game.isPlayerTwoComputer
      ? false
      : this.#game.isPlayerTwoTurn();

    this.#renderBoard(this.#game.boardOne, this.#playerOneDiv, showBoardOne);
    this.#renderBoard(this.#game.boardTwo, this.#playerTwoDiv, showBoardTwo);
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

            if (this.#game.activePlayer.isPlayerComputer()) {
              // Add a 600ms delay to simulate the computer "thinking"
              setTimeout(() => {
                this.#game.playComputerTurn();
                this.updateScreen();
              }, 1000);
            }
          });
        }

        boardDiv.appendChild(cell);
      }
    }
  }
}
