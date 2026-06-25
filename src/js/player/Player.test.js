import { Player } from "./Player.js";

describe("Player Factory", () => {
  test("should successfully instantiate with valid types", () => {
    expect(() => new Player("PLAYER")).not.toThrow();
    expect(() => new Player("COMPUTER")).not.toThrow();
  });

  test("should throw an error for invalid player types", () => {
    expect(() => new Player("ALIEN")).toThrow(
      new Error("Player type are either COMPUTER or PLAYER"),
    );
  });

  test("getComputerMove should return a properly formatted coordinate string", () => {
    const computer = new Player("COMPUTER");
    const move = computer.getComputerMove();

    // Checks that it's a string starting with A-J and ending with 1-10
    expect(typeof move).toBe("string");
    expect(move).toMatch(/^[A-J]([1-9]|10)$/);
  });

  test("getComputerMove should return exactly 100 unique coordinates", () => {
    const computer = new Player("COMPUTER");
    const uniqueMoves = new Set();

    for (let i = 0; i < 100; i++) {
      uniqueMoves.add(computer.getComputerMove());
    }

    // Because Sets reject duplicates, a size of 100 proves every move was unique
    expect(uniqueMoves.size).toBe(100);

    // Asking for a 101st move from an empty array should return undefined
    expect(computer.getComputerMove()).toBeUndefined();
  });
});
