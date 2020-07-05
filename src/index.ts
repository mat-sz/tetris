import './App.scss';

import { boardHeight, boardWidth, boxWidth } from './constants';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

canvas.width = boardWidth * boxWidth;
canvas.height = boardHeight * boxWidth;

const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

resetGameButton.addEventListener('click', () => {
  // Reset here
});

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});
