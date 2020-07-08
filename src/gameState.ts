import { boardHeight, boardWidth, tetrominos } from './constants';
import { Rotation } from './types';
import { getRotatedPiece } from './functions';

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
}
