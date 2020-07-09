import { boardHeight, boardWidth, tetrominos } from './constants';
import { Rotation } from './types';
import { getRotatedPiece, detectOverlap } from './functions';

export class GameState {
  board: number[];
  pieceIndex: number;
  pieceX: number;
  pieceY: number;
  pieceRotation: Rotation;

  constructor() {
    this.reset();
  }

  reset() {
    this.board = new Array(boardHeight * boardWidth).fill(0);
    this.pieceY = 0;
    this.pieceX = boardWidth / 2 - 2;
    this.pieceIndex = 1;
    this.pieceRotation = Rotation.ROTATE_0;
  }

  get originalPiece(): number[] {
    return tetrominos[this.pieceIndex];
  }

  get piece(): number[] {
    return getRotatedPiece(this.originalPiece, this.pieceRotation);
  }

  get pieceSize(): number {
    return this.originalPiece.length === 16 ? 4 : 3;
  }

  commitPiece() {
    const { piece, pieceSize } = this;
    for (let i = 0; i < piece.length; i++) {
      if (piece[i] === 0) {
        continue;
      }

      const x = i % pieceSize;
      const y = Math.floor(i / pieceSize);

      const boardX = this.pieceX + x;
      const boardY = this.pieceY + y;

      this.board[boardY * boardWidth + boardX] = piece[i];
    }

    this.pieceIndex = 1;
    this.pieceX = boardWidth / 2 - 2;
    this.pieceY = 0;
  }

  step() {
    if (
      detectOverlap(
        this.piece,
        this.pieceX,
        this.pieceY + 1,
        this.board,
        boardWidth
      )
    ) {
      this.commitPiece();
    } else {
      this.pieceY++;
    }
  }

  moveX(amount = 0) {
    const newX = this.pieceX + amount;
    if (!detectOverlap(this.piece, newX, this.pieceY, this.board, boardWidth)) {
      this.pieceX = newX;
    }
  }

  rotate() {
    for (let i = 1; i < 4; i++) {
      if (
        !detectOverlap(
          getRotatedPiece(this.originalPiece, (this.pieceRotation + i) % 4),
          this.pieceX,
          this.pieceY,
          this.board,
          boardWidth
        )
      ) {
        this.pieceRotation = (this.pieceRotation + i) % 4;
        break;
      }
    }
  }
}
