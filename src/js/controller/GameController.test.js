import { GameController } from "./GameController.js";

describe("GameController", () => {
  let controller;

  beforeEach(() => {
    controller = new GameController();
  });

  test("should initialize with Player One as the active player", () => {
    // Utilizing the ActivePlayer getter
    expect(controller.ActivePlayer.isPlayerComputer()).toBe(false);
  });

  test("should automatically place 5 ships on both boards during initialization", () => {
    // Utilizing the boardOne and boardTwo getters
    const boardOne = controller.boardOne;
    const boardTwo = controller.boardTwo;

    // Both boards should have active ships, so isSunk is false
    expect(boardOne.areAllShipsSunk()).toBe(false);
    expect(boardTwo.areAllShipsSunk()).toBe(false);
  });

  test("playRound should process a player move and trigger the computer's automatic counter-attack", () => {
    const consoleSpy = jest.spyOn(console, "log");

    // Player One takes a manual turn
    controller.playRound("A", 1);

    // playRound recursively calls itself for the computer turn,
    // resulting in exactly two console logs.
    expect(consoleSpy).toHaveBeenCalledWith("Player One attacks A1");
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    // The active player should switch back to Player One
    expect(controller.ActivePlayer.isPlayerComputer()).toBe(false);

    consoleSpy.mockRestore();
  });
});
