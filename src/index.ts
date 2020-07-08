import './App.scss';

import { boardHeight, boardWidth, boxWidth } from './constants';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

canvas.width = boardWidth * boxWidth;
canvas.height = boardHeight * boxWidth;

const tetrominos = [
  // I
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  // J
  [1, 0, 0, 1, 1, 1, 0, 0, 0],
  // L
  [0, 0, 1, 1, 1, 1, 0, 0, 0],
  // O
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  // S
  [0, 1, 1, 1, 1, 0, 0, 0, 0],
  // Z
  [1, 1, 0, 0, 1, 1, 0, 0, 0],
  // T
  [0, 1, 0, 1, 1, 1, 0, 0, 0],
];

// Game state
const board = new Array(boardHeight * boardWidth).fill(0);
let currentY = 0;
let currentX = boardWidth / 2 - 2;
let currentPiece = 1;
let currentRotation = 0;

const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

const getRotatedPiece = (piece: number[], rotation: number): number[] => {
  const pieceSize = piece.length === 16 ? 4 : 3;
  const newPiece = new Array(piece.length);

  for (let i = 0; i < piece.length; i++) {
    let x = i % pieceSize;
    let y = Math.floor(i / pieceSize);
    switch (rotation) {
      case 1:
        {
          let temp = x;
          x = pieceSize - 1 - y;
          y = temp;
        }
        break;
      case 2:
        x = pieceSize - 1 - x;
        y = pieceSize - 1 - y;
        break;
      case 3:
        {
          let temp = y;
          y = pieceSize - 1 - x;
          x = temp;
        }
        break;
    }

    newPiece[y * pieceSize + x] = piece[i];
  }

  return newPiece;
};

const detectOverlap = (
  piece: number[],
  pieceX: number,
  pieceY: number,
  board: number[],
  boardWidth: number
): boolean => {
  const pieceSize = piece.length === 16 ? 4 : 3;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const boardX = pieceX + x;
    const boardY = pieceY + y;

    if (
      boardX >= boardWidth ||
      boardX < 0 ||
      boardY >= board.length / boardWidth
    ) {
      return true;
    }

    if (board[boardY * boardWidth + boardX] !== 0) {
      return true;
    }
  }

  return false;
};

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const draw = () => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board.
  ctx.fillStyle = 'red';
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) {
      continue;
    }

    const x = i % boardWidth;
    const y = Math.floor(i / boardWidth);

    const canvasX = x * boxWidth;
    const canvasY = y * boxWidth;
    ctx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  // Draw current piece.
  ctx.fillStyle = 'green';
  const piece = getRotatedPiece(tetrominos[currentPiece], currentRotation);
  const pieceSize = piece.length === 16 ? 4 : 3;

  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const canvasX = (currentX + x) * boxWidth;
    const canvasY = (currentY + y) * boxWidth;
    ctx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  requestAnimationFrame(draw);
};

const nextPiece = () => {
  const piece = getRotatedPiece(tetrominos[currentPiece], currentRotation);
  const pieceSize = piece.length === 16 ? 4 : 3;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const boardX = currentX + x;
    const boardY = currentY + y;

    board[boardY * boardWidth + boardX] = piece[i];
  }

  currentPiece = 1;
  currentX = boardWidth / 2 - 2;
  currentY = 0;
};

const step = () => {
  if (
    detectOverlap(
      getRotatedPiece(tetrominos[currentPiece], currentRotation),
      currentX,
      currentY + 1,
      board,
      boardWidth
    )
  ) {
    nextPiece();
  } else {
    currentY++;
  }
};

setInterval(step, 500);

requestAnimationFrame(draw);

resetGameButton.addEventListener('click', () => {
  // Reset here
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      // TODO: Faster fall.
      break;
    case 'ArrowUp':
      for (let i = 0; i < 3; i++) {
        if (
          !detectOverlap(
            getRotatedPiece(tetrominos[currentPiece], currentRotation + 1),
            currentX,
            currentY,
            board,
            boardWidth
          )
        ) {
          currentRotation = (currentRotation + 1) % 4;
          break;
        }
      }
      break;
    case 'ArrowLeft':
      if (
        !detectOverlap(
          getRotatedPiece(tetrominos[currentPiece], currentRotation),
          currentX - 1,
          currentY,
          board,
          boardWidth
        )
      ) {
        currentX--;
      }
      break;
    case 'ArrowRight':
      if (
        !detectOverlap(
          getRotatedPiece(tetrominos[currentPiece], currentRotation),
          currentX + 1,
          currentY,
          board,
          boardWidth
        )
      ) {
        currentX++;
      }
      break;
  }
});
