import './App.scss';

import {
  boardHeight,
  boardWidth,
  boxWidth,
  defaultInterval,
  quickInterval,
} from './constants';
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

let stepInterval = defaultInterval;
let stepTimeout: NodeJS.Timeout;

const step = () => {
  state.step();
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
      stepInterval = quickInterval;
      clearTimeout(stepTimeout);
      step();
      break;
    case 'ArrowUp':
      state.rotate();
      break;
    case 'ArrowLeft':
      state.moveX(-1);
      break;
    case 'ArrowRight':
      state.moveX(1);
      break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowDown':
      stepInterval = defaultInterval;
      break;
  }
});
