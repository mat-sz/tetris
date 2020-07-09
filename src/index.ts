import './App.scss';

import {
  boardHeight,
  boardWidth,
  boxWidth,
  defaultInterval,
  quickInterval,
} from './constants';
import { GameState } from './gameState';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const nextPieceCanvas = document.getElementById(
  'nextPieceCanvas'
) as HTMLCanvasElement;

gameCanvas.width = boardWidth * boxWidth;
gameCanvas.height = boardHeight * boxWidth;
nextPieceCanvas.width = 4 * boxWidth;
nextPieceCanvas.height = 4 * boxWidth;

// Game state
const state = new GameState();

const gameCtx = gameCanvas.getContext('2d');
const nextPieceCtx = nextPieceCanvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const draw = () => {
  gameCtx.fillStyle = '#000000';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw board.
  gameCtx.fillStyle = 'red';
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] === 0) {
      continue;
    }

    const x = i % boardWidth;
    const y = Math.floor(i / boardWidth);

    const canvasX = x * boxWidth;
    const canvasY = y * boxWidth;
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  // Draw current piece.
  gameCtx.fillStyle = 'green';

  const { piece, pieceSize } = state;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    const canvasX = (state.pieceX + x) * boxWidth;
    const canvasY = (state.pieceY + y) * boxWidth;
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  // Draw next piece.
  nextPieceCtx.fillStyle = '#000000';
  nextPieceCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  nextPieceCtx.fillStyle = 'green';

  const { nextPiece, nextPieceSize } = state;
  for (let i = 0; i < nextPiece.length; i++) {
    if (nextPiece[i] === 0) {
      continue;
    }

    const x = i % nextPieceSize;
    const y = Math.floor(i / nextPieceSize);

    const canvasX = x * boxWidth;
    const canvasY = y * boxWidth;
    nextPieceCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  requestAnimationFrame(draw);
};

let stepInterval = defaultInterval;
let stepTimeout: number;

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
