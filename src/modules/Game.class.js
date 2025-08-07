'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialBoard = initialState;
    this.board = JSON.parse(JSON.stringify(initialState));
    this.boardScore = 0;
    this.status = 'idle';
    this.isGameWon = false;
    this.isGameLose = false;
    this.isAbleMove = true;
    this.isGameActive = false;
  }

  moveLeft() {
    if (this.isGameActive) {
      this.move('left');
    }
  }
  moveRight() {
    if (this.isGameActive) {
      this.move('right');
    }
  }
  moveUp() {
    if (this.isGameActive) {
      this.move('up');
    }
  }
  moveDown() {
    if (this.isGameActive) {
      this.move('down');
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.boardScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    switch (true) {
      case this.isGameWon:
        this.status = 'win';
        break;
      case this.isGameLose:
        this.status = 'lose';
        break;
      case this.isGameActive:
        this.status = 'playing';
        break;
      default:
        this.status = 'idle';
        break;
    }

    return this.status;
  }

  start() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));

    this.isGameActive = true;
    this.placeNewCell();
    this.placeNewCell();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.boardScore = 0;

    this.currentStatus = 'idle';
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLose = false;
  }

  placeNewCell() {
    let rRow, rColumn;

    do {
      rRow = Math.floor(Math.random() * 4);
      rColumn = Math.floor(Math.random() * 4);
    } while (this.board[rRow][rColumn] !== 0);

    this.board[rRow][rColumn] = this.createNewCell();
  }

  createNewCell() {
    const randomValue = Math.random();

    return randomValue < 0.1 ? 4 : 2;
  }

  move(direction) {
    if (!this.isGameActive) {
      return;
    }

    const numCols = this.board[0].length;
    let currentTable = JSON.parse(JSON.stringify(this.board));
    let addScore = 0;

    const transpose = (table) => {
      return table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
    };

    const reverseRow = (table) => {
      return table.map((row) => row.slice().reverse());
    };

    const moveTable = (table) => {
      const newTable = table.map((row) => {
        let newRow = row.filter((num) => num !== 0);
        const zeroToAdd = numCols - newRow.length;

        newRow = [...Array(zeroToAdd).fill(0), ...newRow];

        for (let i = newRow.length; i >= 0; i--) {
          if (newRow[i - 1] === newRow[i]) {
            newRow[i - 1] *= 2;
            newRow[i] = 0;
            addScore += newRow[i - 1];
            i--;
          }
        }

        newRow = newRow.filter((num) => num !== 0);

        const zerosToAddEnd = numCols - newRow.length;

        newRow = [...Array(zerosToAddEnd).fill(0), ...newRow];

        return newRow;
      });

      return newTable;
    };

    const isGameOver = () => {
      const Gamefield = 4;

      for (let i = 0; i < Gamefield; i++) {
        for (let j = 0; j < Gamefield; j++) {
          if (this.board[i][j] === 0) {
            return false;
          }
        }
      }

      for (let i = 0; i < Gamefield; i++) {
        for (let j = 0; j < Gamefield; j++) {
          if (j < Gamefield - 1 && this.board[i][j] === this.board[i][j + 1]) {
            return false;
          }

          if (i < Gamefield - 1 && this.board[i][j] === this.board[i + 1][j]) {
            return false;
          }
        }
      }

      this.isGameActive = false;
      this.isGameLose = true;

      return true;
    };

    const makeMove = (moveToSide) => {
      if (JSON.stringify(moveToSide) === JSON.stringify(currentTable)) {
        return;
      }

      this.board = moveToSide;
      currentTable = moveToSide;

      if (this.board.flat().includes(2048)) {
        this.isGameActive = false;
        this.isGameWon = true;

        this.getStatus();

        return;
      }

      this.placeNewCell();

      this.isAbleMove = !isGameOver();
    };

    switch (direction) {
      case 'up':
        const moveUp = transpose(
          reverseRow(moveTable(reverseRow(transpose(currentTable)))),
        );

        makeMove(moveUp);

        this.boardScore += addScore;
        break;
      case 'down':
        const moveDown = transpose(moveTable(transpose(currentTable)));

        makeMove(moveDown);

        this.boardScore += addScore;
        break;
      case 'right':
        const moveRight = moveTable(currentTable);

        makeMove(moveRight);

        this.boardScore += addScore;
        break;
      case 'left':
        const moveLeft = reverseRow(moveTable(reverseRow(currentTable)));

        makeMove(moveLeft);

        this.boardScore += addScore;
        break;
    }
  }
}

export default Game;
