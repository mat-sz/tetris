import './App.scss';

import { boardHeight, boardWidth, boxWidth } from './constants';
import { detectOverlap, getRotatedPiece } from './functions';
import { GameState } from './gameState';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

canvas.width = boardWidth * boxWidth;
canvas.height = boardHeight * boxWidth;

// Game state
const state = new GameState();

const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const draw = () => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board.
  ctx.fillStyle = 'red';
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] === 0) {
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

  const { piece, pieceSize } = state;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const canvasX = (state.pieceX + x) * boxWidth;
    const canvasY = (state.pieceY + y) * boxWidth;
    ctx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  requestAnimationFrame(draw);
};

const nextPiece = () => {
  const { piece, pieceSize } = state;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const boardX = state.pieceX + x;
    const boardY = state.pieceY + y;

    state.board[boardY * boardWidth + boardX] = piece[i];
  }

  state.pieceIndex = 1;
  state.pieceX = boardWidth / 2 - 2;
  state.pieceY = 0;
};

let stepInterval = 500;
let stepTimeout: NodeJS.Timeout;

const step = () => {
  if (
    detectOverlap(
      state.piece,
      state.pieceX,
      state.pieceY + 1,
      state.board,
      boardWidth
    )
  ) {
    nextPiece();
  } else {
    state.pieceY++;
  }

  stepTimeout = setTimeout(step, stepInterval);
};

stepTimeout = setTimeout(step, stepInterval);

requestAnimationFrame(draw);

resetGameButton.addEventListener('click', () => {
  state.reset();
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      stepInterval = 100;
      clearTimeout(stepTimeout);
      step();
      break;
    case 'ArrowUp':
      for (let i = 1; i < 4; i++) {
        if (
          !detectOverlap(
            getRotatedPiece(state.originalPiece, (state.pieceRotation + i) % 4),
            state.pieceX,
            state.pieceY,
            state.board,
            boardWidth
          )
        ) {
          state.pieceRotation = (state.pieceRotation + i) % 4;
          break;
        }
      }
      break;
    case 'ArrowLeft':
      if (
        !detectOverlap(
          state.piece,
          state.pieceX - 1,
          state.pieceY,
          state.board,
          boardWidth
        )
      ) {
        state.pieceX--;
      }
      break;
    case 'ArrowRight':
      if (
        !detectOverlap(
          state.piece,
          state.pieceX + 1,
          state.pieceY,
          state.board,
          boardWidth
        )
      ) {
        state.pieceX++;
      }
      break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowDown':
      stepInterval = 500;
      break;
  }
});
