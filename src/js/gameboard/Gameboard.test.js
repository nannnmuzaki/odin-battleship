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
