// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import Block from "../Block";
import Board from "./Board";
import BoardController from "./BoardController";
import { BlockType, STATE } from "../GameConstant";

const { ccclass, property } = cc._decorator;

@ccclass("Breadth First Search")
export default class FindPath {
  private colM: number;
  private rowM: number;
  public matrixBlock: Block[][] = [];
  private board: Board = null;

  private pathSave: [number, number][] = [];

  constructor(board: Board) {
    this.board = board;
    this.matrixBlock = board.matrixBlock;
    this.rowM = board.getRow() - 2;
    this.colM = board.getCol() - 2;
  }

  private checkLineX(y1: number, y2: number, x: number): boolean {
    let min = Math.min(y1, y2);
    let max = Math.max(y1, y2);
    for (let y = min + 1; y < max; ++y) {
      if (this.matrixBlock[x][y].blockType != 0) {
        return false;
      }
    }
    return true;
  }

  private checkLineY(x1: number, x2: number, y: number): boolean {
    let min = Math.min(x1, x2);
    let max = Math.max(x1, x2);
    for (let x = min + 1; x < max; ++x) {
      if (this.matrixBlock[x][y].blockType != 0) {
        return false;
      }
    }
    return true;
  }

  private checkRectX(block1: Block, block2: Block) {
    let bMinY = block1,
      bMaxY = block2;
    if (block1.getCol() > block2.getCol()) {
      bMinY = block2;
      bMaxY = block1;
    }
    for (let y = bMinY.getCol(); y <= bMaxY.getCol(); y++) {
      if (
        y > bMinY.getCol() &&
        this.matrixBlock[bMinY.getRow()][y].blockType != 0
      ) {
        return -1;
      }
      if (
        this.matrixBlock[bMaxY.getRow()][y].blockType == 0 &&
        this.checkLineY(bMinY.getRow(), bMaxY.getRow(), y) &&
        this.checkLineX(y, bMaxY.getCol(), bMaxY.getRow()) //
      ) {
        return y;
      }
    }
    return -1;
  }

  private checkRectY(block1: Block, block2: Block) {
    let bMinX = block1,
      bMaxX = block2;
    if (block1.getRow() > block2.getRow()) {
      bMinX = block2;
      bMaxX = block1;
    }
    for (let x = bMinX.getRow(); x <= bMaxX.getRow(); x++) {
      if (
        x > bMinX.getRow() &&
        this.matrixBlock[x][bMinX.getCol()].blockType != 0
      ) {
        return -1;
      }
      if (
        this.matrixBlock[x][bMaxX.getCol()].blockType == 0 &&
        this.checkLineX(bMinX.getCol(), bMaxX.getCol(), x) &&
        this.checkLineY(x, bMaxX.getRow(), bMaxX.getCol())
      ) {
        return x;
      }
    }
    return -1;
  }

  private checkMoreLineX(block1: Block, block2: Block, type: number) {
    let pMinY: Block = block1;
    let pMaxY: Block = block2;
    if (block1.getCol() > block2.getCol()) {
      pMinY = block2;
      pMaxY = block1;
    }
    let y = pMaxY.getCol() + type;
    let row = pMinY.getRow();
    let colFinish = pMaxY.getCol();
    if (type == -1) {
      colFinish = pMinY.getCol();
      y = pMinY.getCol() + type;
      row = pMaxY.getRow();
    }

    if (
      (this.matrixBlock[row][colFinish].blockType == 0 ||
        pMinY.getCol() == pMaxY.getCol()) &&
      this.checkLineX(pMinY.getCol(), pMaxY.getCol(), row)
    ) {
      while (
        this.matrixBlock[pMinY.getRow()][y].blockType == 0 &&
        this.matrixBlock[pMaxY.getRow()][y].blockType == 0
      ) {
        if (this.checkLineY(pMinY.getRow(), pMaxY.getRow(), y)) {
          return y;
        }
        y += type;
      }
    }
    return -1;
  }

  private checkMoreLineY(block1: Block, block2: Block, type: number) {
    let pMinX: Block = block1;
    let pMaxX: Block = block2;
    if (block1.getRow() > block2.getRow()) {
      pMinX = block2;
      pMaxX = block1;
    }
    let x = pMaxX.getRow() + type;
    let col = pMinX.getCol();
    let rowFinish = pMaxX.getRow();
    if (type == -1) {
      rowFinish = pMinX.getRow();
      x = pMinX.getRow() + type;
      col = pMaxX.getCol();
    }
    if (
      (this.matrixBlock[rowFinish][col].blockType == 0 ||
        pMinX.getRow() == pMaxX.getRow()) &&
      this.checkLineY(pMinX.getRow(), pMaxX.getRow(), col)
    ) {
      while (
        this.matrixBlock[x][pMaxX.getCol()].blockType == 0 &&
        this.matrixBlock[x][pMinX.getCol()].blockType == 0
      ) {
        if (this.checkLineX(pMinX.getCol(), pMaxX.getCol(), x)) {
          return x;
        }
        x += type;
      }
    }
    return -1;
  }

  public checkTwoPoint(block1: Block, block2: Block) {
    this.pathSave = [];
    if (
      block1 != block2 &&
      this.matrixBlock[block1.getRow()][block1.getCol()].blockType ==
        this.matrixBlock[block2.getRow()][block2.getCol()].blockType
    ) {
      //set visited:
      let type1 = this.setVisited(block1);
      let type2 = this.setVisited(block2);

      if (block1.getCol() == block2.getCol()) {
        if (
          this.checkLineY(block1.getRow(), block2.getRow(), block1.getCol())
        ) {
          // console.log([block1.getRow(), block1.getCol()]);
          // console.log([block2.getRow(), block2.getCol()]);
          this.pathSave.push([block1.getRow(), block1.getCol()]);
          this.pathSave.push([block2.getRow(), block2.getCol()]);
          return true;
        }
      }

      if (block1.getRow() == block2.getRow()) {
        if (
          this.checkLineX(block1.getCol(), block2.getCol(), block1.getRow())
        ) {
          // console.log([block1.getRow(), block1.getCol()]);
          // console.log([block2.getRow(), block2.getCol()]);
          this.pathSave.push([block1.getRow(), block1.getCol()]);
          this.pathSave.push([block2.getRow(), block2.getCol()]);
          return true;
        }
      }

      let t = -1;

      if ((t = this.checkRectX(block1, block2)) != -1) {
        this.pathSave.push([block1.getRow(), t]);
        this.pathSave.push([block2.getRow(), t]);
        return true;
      }

      if ((t = this.checkRectY(block1, block2)) != -1) {
        this.pathSave.push([t, block1.getCol()]);
        this.pathSave.push([t, block2.getCol()]);
        return true;
      }

      if ((t = this.checkMoreLineX(block1, block2, 1)) != -1) {
        this.pathSave.push([block1.getRow(), t]);
        this.pathSave.push([block2.getRow(), t]);
        return true;
      }

      if ((t = this.checkMoreLineX(block1, block2, -1)) != -1) {
        this.pathSave.push([block1.getRow(), t]);
        this.pathSave.push([block2.getRow(), t]);
        return true;
      }

      if ((t = this.checkMoreLineY(block1, block2, 1)) != -1) {
        this.pathSave.push([t, block1.getCol()]);
        this.pathSave.push([t, block2.getCol()]);
        return true;
      }

      if ((t = this.checkMoreLineY(block1, block2, -1)) != -1) {
        this.pathSave.push([t, block1.getCol()]);
        this.pathSave.push([t, block2.getCol()]);
        return true;
      }

      this.resetVisited(block1, type1);
      this.resetVisited(block2, type2);
    }
    return false;
  }

  private setVisited(block: Block): BlockType {
    let type = this.matrixBlock[block.getRow()][block.getCol()].blockType;
    this.matrixBlock[block.getRow()][block.getCol()].blockType = 0;
    return type;
  }

  private resetVisited(block: Block, type: BlockType): void {
    this.matrixBlock[block.getRow()][block.getCol()].blockType = type;
  }

  public showPath() {
    //chuyen sang toa do world
    let result: Block[] = [];

    for (let i = 0; i < this.pathSave.length; ++i) {
      result.push(this.matrixBlock[this.pathSave[i][0]][this.pathSave[i][1]]);
    }
    return result;
  }

  //x = col
  //y = row
}
