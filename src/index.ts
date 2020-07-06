import './App.scss';

import { boardHeight, boardWidth, boxWidth } from './constants';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

canvas.width = boardWidth * boxWidth;
canvas.height = boardHeight * boxWidth;

const board = new Array(boardHeight * boardWidth).fill(0);

const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

resetGameButton.addEventListener('click', () => {
  // Reset here
});

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});

const draw = () => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
