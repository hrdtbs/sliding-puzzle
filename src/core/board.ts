export class Board {
  current: number[] = [];
  size = 0;
  solved = false;
  constructor(size?: number) {
    if (size) {
      this.init(size);
      this.size = size;
    }
  }
  init = (size: number) => {
    this.current = shuffleBoard(generateBoard(size), size);
  };
  move = (x: number, y: number) => {
    const moved = tryMoveSquare(this.current, this.size, x, y);
    if (moved) {
      this.solved = isSolvedBoard(this.current);
    }
    return moved;
  };
  forEach = (
    callback?: (sx: number, sy: number, dx: number, dy: number) => void
  ) => {
    if (callback === undefined) return;
    const columnCount = this.size;
    const rowCount = this.size;
    for (let dx = 0; dx < columnCount; dx++) {
      for (let dy = 0; dy < rowCount; dy++) {
        const index = getSquareId(this.current, this.size, dx, dy);
        if (index === -1) {
          continue;
        }
        const [sx, sy] = getSquarePosition(this.size, index);
        callback(sx, sy, dx, dy);
      }
    }
  };
}

const generateBoard = (size: number) => {
  const columnCount = size;
  const rowCount = size;
  const board = [];
  for (let i = 0; i < columnCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      if (i === columnCount - 1 && j === rowCount - 1) {
        board.push(-1);
      } else {
        board.push(i * rowCount + j);
      }
    }
  }
  return board;
};

function isSolvableBoard(size: number, idArray: number[]) {
  let invCount = getInvCount(size, idArray);
  if (size & 1) {
    return !(invCount & 1);
  } else {
    let rowFromBottom = findBlankRowPositionFromBottom(size, idArray);
    if (rowFromBottom & 1) return !(invCount & 1);
    else return invCount & 1;
  }
}

function getInvCount(size: number, idArray: number[]) {
  let invCount = 0;
  for (let i = 0; i < size * size - 1; i++) {
    for (let j = i + 1; j < size * size; j++) {
      if (idArray[j] !== -1 && idArray[i] !== -1 && idArray[i] > idArray[j]) {
        invCount++;
      }
    }
  }
  return invCount;
}

function findBlankRowPositionFromBottom(size: number, idArray: number[]) {
  const blankTileIdx = idArray.findIndex((t) => t === -1);
  const row = Math.floor(blankTileIdx / size);
  let rowFromBottom = size - row;
  return rowFromBottom;
}

const shuffleBoard = (board: number[], size: number) => {
  let solvable = false;
  while (!solvable) {
    shuffle(board);
    if (isSolvableBoard(size, board)) {
      solvable = true;
    }
  }
  return board;
};

const random = (lower: number, upper: number) => {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
};

const shuffle = (array: unknown[]) => {
  let index = -1;
  const length = array.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const rand = random(index, lastIndex);
    const current = array[rand];

    array[rand] = array[index];
    array[index] = current;
  }
  return array;
};

const isSolvedBoard = (board: number[]) => {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i) {
      return false;
    }
  }
  return true;
};

const getSquareId = (board: number[], size: number, x: number, y: number) => {
  const rowCount = size;
  return board[x * rowCount + y];
};

const getSquarePosition = (size: number, index: number) => {
  const rowCount = size;
  const x = Math.floor(index / rowCount);
  const y = index % rowCount;
  return [x, y];
};

const tryMoveSquare = (board: number[], size: number, x: number, y: number) => {
  const blankIndex = findBlankSquare(board);
  const [blankX, blankY] = getSquarePosition(size, blankIndex);
  if (isNeighborSquare(x, y, blankX, blankY)) {
    swap(board, blankIndex, x * size + y);
    return true;
  } else {
    return false;
  }
};

const swap = (arr: number[], i: number, j: number) => {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const findBlankSquare = (board: number[]) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) {
      return i;
    }
  }
  throw new Error("no blank");
};

const isNeighborSquare = (i: number, j: number, x: number, y: number) => {
  if (i !== x && j !== y) {
    return false;
  }
  if (Math.abs(i - x) == 1 || Math.abs(j - y) == 1) {
    return true;
  }
  return false;
};
