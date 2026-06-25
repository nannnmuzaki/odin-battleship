import { Gameboard } from "./Gameboard.js";

describe("Gameboard - placeShip", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("should successfully place a valid horizontal ship", () => {
    expect(() => gameboard.placeShip("A", 1, "HORIZONTAL", 3)).not.toThrow();
  });

  test("should successfully place a valid vertical ship", () => {
    expect(() => gameboard.placeShip("E", 5, "VERTICAL", 4)).not.toThrow();
  });

  test("should reject overlapping ships (intersecting paths)", () => {
    // Places at B2, C2, D2
    gameboard.placeShip("B", 2, "HORIZONTAL", 3);

    // Tries to place at C1, C2, C3. Should crash at C2.
    expect(() => gameboard.placeShip("C", 1, "VERTICAL", 3)).toThrow(
      new RangeError("C2 coordinate is already occupied"),
    );
  });

  test("should reject horizontal placement spilling off the right edge", () => {
    // J is valid, but length 2 means it tries to hit "K"
    expect(() => gameboard.placeShip("J", 4, "HORIZONTAL", 2)).toThrow(
      new RangeError("this ship placement is out of bound"),
    );
  });

  test("should reject vertical placement spilling off the bottom edge", () => {
    // 9 is valid, but length 3 means it tries to hit 9, 10, 11
    expect(() => gameboard.placeShip("F", 9, "VERTICAL", 3)).toThrow(
      new RangeError("this ship placement is out of bound"),
    );
  });

  test("should reject invalid coordinate inputs", () => {
    expect(() => gameboard.placeShip("Z", 1, "HORIZONTAL", 3)).toThrow(
      RangeError,
    );
    expect(() => gameboard.placeShip("A", 15, "HORIZONTAL", 3)).toThrow(
      RangeError,
    );
    expect(() => gameboard.placeShip("AA", 1, "HORIZONTAL", 3)).toThrow(
      TypeError,
    );
  });

  test("should reject invalid orientation and lengths", () => {
    expect(() => gameboard.placeShip("A", 1, "DIAGONAL", 3)).toThrow(Error);
    expect(() => gameboard.placeShip("A", 1, "HORIZONTAL", 1)).toThrow(Error); // Too short
    expect(() => gameboard.placeShip("A", 1, "HORIZONTAL", 6)).toThrow(Error); // Too long
  });
});

describe("Gameboard - receiveAttack & areAllShipsSunk", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("should return false when firing at empty water (a miss)", () => {
    // Board is completely empty
    expect(gameboard.receiveAttack("A", 1)).toBe(false);
  });

  test("should return true when hitting a ship", () => {
    gameboard.placeShip("C", 3, "HORIZONTAL", 3); // Occupies C3, D3, E3
    expect(gameboard.receiveAttack("D", 3)).toBe(true);
  });

  test("should throw an error if the coordinate was already attacked", () => {
    gameboard.receiveAttack("F", 5); // First shot is fine

    expect(() => gameboard.receiveAttack("F", 5)).toThrow(
      new Error("this coordinate is already hit"),
    );
  });

  test("should reject invalid attack coordinates", () => {
    expect(() => gameboard.receiveAttack("Z", 1)).toThrow(RangeError);
    expect(() => gameboard.receiveAttack("A", 15)).toThrow(RangeError);
    expect(() => gameboard.receiveAttack(1, "A")).toThrow(TypeError);
  });

  test("should accurately report when all ships are sunk", () => {
    // Board starts empty, so technically 0 ships alive
    expect(gameboard.areAllShipsSunk()).toBe(true);

    // Place a length 2 ship at A1, B1
    gameboard.placeShip("A", 1, "HORIZONTAL", 2);
    expect(gameboard.areAllShipsSunk()).toBe(false); // Game is on!

    // Hit the first half
    gameboard.receiveAttack("A", 1);
    expect(gameboard.areAllShipsSunk()).toBe(false); // Still alive

    // Hit the second half, sinking it
    gameboard.receiveAttack("B", 1);
    expect(gameboard.areAllShipsSunk()).toBe(true); // Fleet destroyed!
  });

  test("should track multiple ships correctly before declaring game over", () => {
    gameboard.placeShip("A", 1, "HORIZONTAL", 2); // Ship 1 (A1, B1)
    gameboard.placeShip("J", 9, "VERTICAL", 2); // Ship 2 (J9, J10)

    gameboard.receiveAttack("A", 1);
    gameboard.receiveAttack("B", 1); // Ship 1 sunk

    expect(gameboard.areAllShipsSunk()).toBe(false); // Ship 2 still alive

    gameboard.receiveAttack("J", 9);
    gameboard.receiveAttack("J", 10); // Ship 2 sunk

    expect(gameboard.areAllShipsSunk()).toBe(true); // Now they are all dead
  });
});
