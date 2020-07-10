import './App.scss';

import {
  boardHeight,
  boardWidth,
  boxWidth,
  defaultInterval,
  quickInterval,
  colors,
  animationLength,
  boardTopPadding,
} from './constants';
import { GameState } from './gameState';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const nextPieceCanvas = document.getElementById(
  'nextPieceCanvas'
) as HTMLCanvasElement;

gameCanvas.width = boardWidth * boxWidth;
gameCanvas.height = (boardHeight + boardTopPadding) * boxWidth;
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
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] === 0) {
      continue;
    }

    gameCtx.globalAlpha = 1;
    gameCtx.fillStyle = colors[state.board[i] - 1];
    const x = i % boardWidth;
    const y = Math.floor(i / boardWidth);

    if (state.animationProgress > 0 && state.animationRows?.includes(y)) {
      gameCtx.globalAlpha = 1 - state.animationProgress / animationLength;
    }

    const canvasX = x * boxWidth;
    const canvasY = (y + boardTopPadding) * boxWidth;
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  state.animationStep();

  // Draw current piece.
  gameCtx.fillStyle = state.pieceColor;

  const { piece, pieceSize } = state;
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === 0) {
      continue;
    }

    const x = i % pieceSize;
    const y = Math.floor(i / pieceSize);

    gameCtx.globalAlpha = 1;
    if (state.pieceY + y < 0) {
      gameCtx.globalAlpha = 0.5;
    }

    const canvasX = (state.pieceX + x) * boxWidth;
    const canvasY = (state.pieceY + y + boardTopPadding) * boxWidth;
    gameCtx.fillRect(canvasX, canvasY, boxWidth, boxWidth);
  }

  // Draw next piece.
  nextPieceCtx.fillStyle = '#000000';
  nextPieceCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  nextPieceCtx.fillStyle = state.nextPieceColor;

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
  e.preventDefault();

  switch (e.key) {
    case ' ':
      state.hardDrop();
      break;
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
