import { Rotation } from './types';

export const getRotatedPiece = (
  piece: number[],
  rotation: Rotation
): number[] => {
  const pieceSize = piece.length === 16 ? 4 : 3;
  const newPiece = new Array(piece.length);

  for (let i = 0; i < piece.length; i++) {
    let x = i % pieceSize;
    let y = Math.floor(i / pieceSize);
    switch (rotation) {
      case Rotation.ROTATE_90:
        {
          let temp = x;
          x = pieceSize - 1 - y;
          y = temp;
        }
        break;
      case Rotation.ROTATE_180:
        x = pieceSize - 1 - x;
        y = pieceSize - 1 - y;
        break;
      case Rotation.ROTATE_270:
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

export const detectOverlap = (
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
