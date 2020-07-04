import './App.scss';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const resetGameButton = document.getElementById('reset-game');

resetGameButton.addEventListener('click', () => {
  // Reset here
});

document.addEventListener('gesturestart', e => {
  // Disable zoom on mobile Safari.
  e.preventDefault();
});
