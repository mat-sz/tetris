import {
  boardHeight,
  boardWidth,
  tetrominos,
  colors,
  animationLength,
} from './constants';
import { Rotation } from './types';
import {
  getRotatedPiece,
  detectOverlap,
  shuffle,
  checkRow,
  removeRow,
} from './functions';

export class GameState {
  board: number[];
  colorIndex: number;
  pieceIndex: number;
  pieceX: number;
  pieceY: number;
  animationProgress: number;
  animationRows: number[];
  pieceRotation: Rotation;
  private _pieceStack: number[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.board = new Array(boardHeight * boardWidth).fill(0);
    this.pieceY = 0;
    this.pieceX = boardWidth / 2 - 2;
    this.colorIndex = 0;
    this.pieceIndex = this.nextPieceIndex;
    this.pieceRotation = Rotation.ROTATE_0;
    this.animationProgress = 0;
    this.animationRows = [];
    this.pieceStack.shift();
  }

  get pieceStack(): number[] {
    if (this._pieceStack.length === 0) {
      this._pieceStack = shuffle([...Array(tetrominos.length).keys()]);
    }

    return this._pieceStack;
  }

  get nextPieceIndex(): number {
    return this.pieceStack[0];
  }

  get nextPiece(): number[] {
    return tetrominos[this.nextPieceIndex];
  }

  get nextPieceSize(): number {
    return this.nextPiece.length === 16 ? 4 : 3;
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

  get pieceColor(): string {
    return colors[this.colorIndex];
  }

  get nextPieceColor(): string {
    return colors[(this.colorIndex + 1) % colors.length];
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

      this.board[boardY * boardWidth + boardX] = this.colorIndex + 1;
    }

    this.colorIndex = (this.colorIndex + 1) % colors.length;
    this.pieceIndex = this.nextPieceIndex;
    this.pieceX = boardWidth / 2 - 2;
    this.pieceY = 0;
    this.pieceStack.shift();
  }

  animationStep() {
    if (!this.animationRows || this.animationRows.length == 0) {
      this.animationProgress = 0;
      return;
    }

    if (this.animationProgress < animationLength) {
      this.animationProgress++;
    } else {
      this.animationProgress = 0;

      for (const rowY of this.animationRows) {
        this.board = removeRow(this.board, boardWidth, rowY);
      }

      this.animationRows = [];
    }
  }

  step() {
    if (this.animationProgress !== 0) {
      return;
    }

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

    for (let rowY = 0; rowY < boardHeight; rowY++) {
      if (checkRow(this.board, boardWidth, rowY)) {
        this.animationRows.push(rowY);
      }
    }

    if (this.animationRows?.length > 0) {
      this.animationProgress = 1;
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
