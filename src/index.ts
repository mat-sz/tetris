import './App.scss';

import { boardHeight, boardWidth, boxWidth } from './constants';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

canvas.width = boardWidth * boxWidth;
canvas.height = boardHeight * boxWidth;

const tetrominos = [
  // I
  [1, 1, 1, 1],
  // J
  [1, 0, 0, 0, 1, 1, 1, 1],
  // L
  [0, 0, 0, 1, 1, 1, 1, 1],
  // O
  [1, 1, 1, 1],
  // S
  [0, 1, 1, 1, 1, 0],
  // Z
  [1, 1, 0, 0, 1, 1],
  // T
  [0, 1, 0, 1, 1, 1],
];

// Game state
const board = new Array(boardHeight * boardWidth).fill(0);
let currentY = 0;
let currentX = 0;
let currentPiece = 1;
let currentRotation = 0;

const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

resetGameButton.addEventListener('click', () => {
  // Reset here
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      // TODO: Faster fall.
      break;
    case 'ArrowUp':
      currentRotation = (currentRotation + 1) % 4;
      break;
    case 'ArrowLeft':
      currentX--;
      break;
    case 'ArrowRight':
      currentX++;
      break;
  }
});

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const getRotatedPiece = (piece: number[], rotation: number) => {
  const pieceHeight = 2;
  const pieceWidth = piece.length / pieceHeight;
  const newPiece = new Array(piece.length);

  for (let i = 0; i < piece.length; i++) {
    let x = i % pieceWidth;
    let y = Math.floor(i / pieceWidth);
    switch (rotation) {
      case 1:
        {
          let temp = x;
          x = pieceHeight - 1 - y;
          y = temp;
        }
        break;
      case 2:
        x = pieceWidth - 1 - x;
        y = pieceHeight - 1 - y;
        break;
      case 3:
        {
          let temp = y;
          y = pieceWidth - 1 - x;
          x = temp;
        }
        break;
    }

    if (rotation % 2 === 0) {
      newPiece[y * pieceWidth + x] = piece[i];
    } else {
      newPiece[y * pieceHeight + x] = piece[i];
    }
  }

  return newPiece;
};

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
  let pieceHeight = 2;
  let pieceWidth = piece.length / pieceHeight;

  if (currentRotation % 2 === 1) {
    [pieceHeight, pieceWidth] = [pieceWidth, pieceHeight];
  }

  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceWidth;
    const y = Math.floor(i / pieceWidth);

    const canvasX = (currentX + x) * boxWidth;
    const canvasY = (currentY + y) * boxWidth;
    ctx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
