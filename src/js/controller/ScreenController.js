import { GameController } from "./GameController.js";

export class ScreenController {
  #game;
  #contentDiv;
  #turnDisplay;
  #playerOneDiv;
  #playerTwoDiv; // currently player two is a computer;
  #currentOrientation = "HORIZONTAL";

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

    const setupPanel = document.createElement("div");
    setupPanel.id = "setup-panel";
    setupPanel.style.marginBottom = "20px"; // Quick spacing

    const rotateBtn = document.createElement("button");
    rotateBtn.textContent = `Orientation: ${this.#currentOrientation}`;
    rotateBtn.addEventListener("click", () => {
      this.#currentOrientation =
        this.#currentOrientation === "HORIZONTAL" ? "VERTICAL" : "HORIZONTAL";
      rotateBtn.textContent = `Orientation: ${this.#currentOrientation}`;
    });

    setupPanel.appendChild(rotateBtn);
    this.#contentDiv.appendChild(setupPanel); // Append before the boards!
  }

  updateScreen() {
    this.#playerOneDiv.textContent = "";
    this.#playerTwoDiv.textContent = "";

    const showBoardOne =
      this.#game.isPlayerOneTurn() || this.#game.isPlayerTwoComputer()
        ? true
        : false;

    const setupPanel = document.getElementById("setup-panel");
    if (setupPanel) {
      setupPanel.style.display = this.#game.isSetupPhase() ? "block" : "none";
    }

    const enemyWrapper = this.#playerTwoDiv.parentElement;
    if (enemyWrapper) {
      enemyWrapper.style.display = this.#game.isSetupPhase() ? "none" : "block";
    }

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

    const showBoardTwo = this.#game.isPlayerTwoComputer()
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

        if (showShips && this.#game.isSetupPhase()) {
          cell.addEventListener("mouseover", () => {
            const length = this.#game.currentShipLength();
            const targetCells = [];
            let isValid = true;

            // Collect all the cells this ship will occupy
            for (let i = 0; i < length; i++) {
              let targetX = x;
              let targetY = y;

              if (this.#currentOrientation === "HORIZONTAL") {
                targetX = String.fromCharCode(xCode + i);
              } else {
                targetY = y + i;
              }

              const tCell = boardDiv.querySelector(
                `[data-x="${targetX}"][data-y="${targetY}"]`,
              );

              if (tCell) {
                targetCells.push(tCell);
                // If the cell already has a ship, it's invalid
                if (tCell.classList.contains("ship")) {
                  isValid = false;
                }
              } else {
                // If tCell is null, it means it went off the board!
                isValid = false;
              }
            }

            // Apply the correct visual state to the collected cells
            targetCells.forEach((tCell) => {
              if (isValid) {
                tCell.classList.add("preview-valid");
              } else {
                tCell.classList.add("preview-invalid");
              }
            });
          });

          cell.addEventListener("mouseout", () => {
            // Clear BOTH valid and invalid preview classes
            const previewCells = boardDiv.querySelectorAll(
              ".preview-valid, .preview-invalid",
            );
            previewCells.forEach((pCell) => {
              pCell.classList.remove("preview-valid");
              pCell.classList.remove("preview-invalid");
            });
          });

          cell.addEventListener("click", () => {
            const success = this.#game.placePlayerShip(
              x,
              y,
              this.#currentOrientation,
            );
            if (success) {
              this.updateScreen();
            }
          });
        }

        if (
          !showShips &&
          !this.#game.isSetupPhase() &&
          this.#game.isPlayerOneTurn()
        ) {
          cell.addEventListener("click", () => {
            this.#game.playRound(x, y);
            this.updateScreen();

            if (this.#game.isPlayerTwoComputer()) {
              setTimeout(() => {
                this.#game.playComputerTurn();
                this.updateScreen();
              }, 1000);
            }
          });
        }

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

        boardDiv.appendChild(cell);
      }
    }
  }
}
