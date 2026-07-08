import { Ship } from "../ship/Ship.js";

export class Gameboard {
  #coordinates = new Map();
  #attackedCoordinates = new Set();
  #aliveShipCount = 0;
  static #allowedOrientation = ["HORIZONTAL", "VERTICAL"];

  get coordinates() {
    return this.#coordinates;
  }

  get attackedCoordinates() {
    return this.#attackedCoordinates;
  }

  placeShip(startX, startY, orientation, length) {
    if (typeof startX !== "string" || startX.trim().length !== 1) {
      throw new TypeError("startX must be A - J");
    }

    const startXCode = startX.trim().toUpperCase().charCodeAt(0);

    if (!(startXCode >= 65 && startXCode <= 74)) {
      throw new RangeError("startX muset be A - J");
    }

    if (!Number.isSafeInteger(startY) || !(startY >= 1 && startY <= 10)) {
      throw new RangeError("startY must be an integer 1 - 10");
    }

    if (
      !Gameboard.#allowedOrientation.includes(orientation.trim().toUpperCase())
    ) {
      throw new Error("Orientation must be VERTICAL or HORIZONTAL");
    }

    if (!(length >= 2 && length <= 5)) {
      throw new Error("Ship length must be between 2 - 5");
    }

    if (this.#coordinates.has(`${startX}${startY}`)) {
      throw new RangeError(`${startX}${startY} coordinate is already occupied`);
    } else {
      if (orientation === Gameboard.#allowedOrientation[0]) {
        for (let i = 0; i < length; i++) {
          if (startXCode + i > 74) {
            throw new RangeError(`this ship placement is out of bound`);
          }

          const nextStartX = String.fromCharCode(startXCode + i);
          if (this.#coordinates.has(`${nextStartX}${startY}`)) {
            throw new RangeError(
              `${nextStartX}${startY} coordinate is already occupied`,
            );
          }
        }
        const ship = new Ship(length);
        for (let i = 0; i < length; i++) {
          const nextStartX = String.fromCharCode(startXCode + i);
          this.#coordinates.set(`${nextStartX}${startY}`, ship);
        }
      }

      if (orientation === Gameboard.#allowedOrientation[1]) {
        for (let i = 0; i < length; i++) {
          if (startY + i > 10) {
            throw new RangeError(`this ship placement is out of bound`);
          }

          if (this.#coordinates.has(`${startX}${startY + i}`)) {
            throw new RangeError(
              `${startX}${startY + i} coordinate is already occupied`,
            );
          }
        }
        const ship = new Ship(length);
        for (let i = 0; i < length; i++) {
          this.#coordinates.set(`${startX}${startY + i}`, ship);
        }
      }

      this.#aliveShipCount++;
    }
  }

  receiveAttack(x, y) {
    if (typeof x !== "string" || x.trim().length !== 1) {
      throw new TypeError("x coordinate must be A - J");
    }

    const xCode = x.trim().toUpperCase().charCodeAt(0);

    if (!(xCode >= 65 && xCode <= 74)) {
      throw new RangeError("x coordinate muset be A - J");
    }

    if (!Number.isSafeInteger(y) || !(y >= 1 && y <= 10)) {
      throw new RangeError("y coordinate must be an integer 1 - 10");
    }

    if (this.#attackedCoordinates.has(`${x}${y}`)) {
      throw new Error("this coordinate is already hit");
    }

    if (this.#coordinates.has(`${x}${y}`)) {
      const ship = this.#coordinates.get(`${x}${y}`);
      ship.hit();
      this.#attackedCoordinates.add(`${x}${y}`);

      if (ship.isSunk()) {
        this.#aliveShipCount--;
      }
      return true;
    }

    this.#attackedCoordinates.add(`${x}${y}`);
    return false;
  }

  areAllShipsSunk() {
    return this.#aliveShipCount === 0;
  }
}
