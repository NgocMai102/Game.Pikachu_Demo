// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameBehaviour from "../GameBehavior";
import SimplePool, { PoolType } from "../Pool/SimplePool";
import Block from "../Block";
import { spaceSize } from "../GameConstant";
import ViewManager from "../Manager/ViewManager";
// import Image from "./Image";

import { STATE } from "../GameConstant";
import BoardController from "./BoardController";
import { ScoreHandle } from "../ScoreHandle";

const { ccclass, property } = cc._decorator;

interface IBlock {
  [key: number]: Block[];
}

@ccclass
export default class Board extends GameBehaviour {
  //tính cả 2 khoảng cách 2 bên và trên dưới thì cộng row và col thêm 2
  @property
  private row: number = 0;
  @property
  private col: number = 0;

  // @property(cc.Component)
  // public boardController: BoardController = null;

  @property(cc.Prefab)
  private block: Block = null;

  public saveIdList: number[] = null;
  public matrixBlock: Block[][] = [];
  public idList: number[] = null;
  public blockSameID: IBlock = null;

  private boardWidth: number = this.col * spaceSize.width;
  private boardHeight: number = this.row * spaceSize.height;

  protected loadComponent(): void {
    super.loadComponent();
    this.initBoard();
  }

  //getter
  public getRow(): number {
    return this.row;
  }
  public getCol(): number {
    return this.col;
  }

  private test() {
    //console.log(this.blockSameID[1].length);
    for (let i = 0; i < this.row; ++i) {
      let s: string = "";
      for (let j = 0; j < this.col; ++j) {
        s += "[" + this.matrixBlock[i][j].blockType;
        ("]");
      }
      console.log(s);
    }
  }

  public initBoard() {
    this.boardWidth = this.col * spaceSize.width;
    this.boardHeight = this.row * spaceSize.height;
    this.idList = this.randomValue((this.col - 2) * (this.row - 2), 28);
    let index = 0;
    for (let i = this.row - 1; i >= 0; --i) {
      let rowBlock: Block[] = [];
      for (let j = 0; j < this.col; ++j) {
        this.block = SimplePool.spawnT(
          PoolType.Block,
          this.posSpawnBlock(i, j),
          0
        );
        this.block.setRowCol(this.row - 1 - i, j);

        this.block.setPos(
          this.posSpawnBlock(i, j).x,
          this.posSpawnBlock(i, j).y
        );
        if (i == 0 || i == this.row - 1 || j == 0 || j == this.col - 1) {
          this.block.setState(STATE.CLOSE);
          this.block.blockType = 0;
        } else {
          this.block.setBlockType(this.idList[index++]);
        }
        rowBlock.push(this.block);
      }
      this.matrixBlock.push(rowBlock);
    }
    this.saveBlockSaveID(this.matrixBlock);
  }

  public resetBlock() {
    this.idList = this.randomValue((this.col - 2) * (this.row - 2), 28);
    let index = 0;
    for (let i = 1; i < this.matrixBlock.length - 1; ++i) {
      for (let j = 1; j < this.matrixBlock[0].length - 1; ++j) {
        this.matrixBlock[i][j].blockType = this.idList[index];
        this.matrixBlock[i][j].setBlockType(this.idList[index++]);
        this.matrixBlock[i][j].resetState();
        this.matrixBlock;
      }
    }
    this.saveBlockSaveID(this.matrixBlock);
  }

  public posSpawnBlock(row: number, col: number): cc.Vec3 {
    return cc.v3(
      -this.boardWidth / 2 + col * spaceSize.width,
      -this.boardHeight / 2 + row * spaceSize.height,
      0
    );
  }

  protected randomValue(num: number, range: number) {
    let arrSameBlock: number[] = Array(num).fill(-1);
    for (let i = 0; i < num; i += 2) {
      let id = Math.round(Math.random() * (range - 1) + 1);
      arrSameBlock[i] = id;
      arrSameBlock[i + 1] = id;
    }
    let result: number[] = [];
    for (let i = 0; i < num; ++i) {
      let idx = Math.round(Math.random() * (arrSameBlock.length - 1));
      result.push(arrSameBlock[idx]);
      arrSameBlock.splice(idx, 1);
    }
    return result;
  }

  public refreshBoard(): void {
    for (let i = 1; i < this.row - 1; ++i) {
      for (let j = 1; j < this.col - 1; ++j) {
        this.matrixBlock[i][j].resetState();
        this.matrixBlock[i][j].setBlockType(this.idList.pop());
      }
    }
    this.saveBlockSaveID(this.matrixBlock);
  }

  protected saveBlockSaveID(board: Block[][]): void {
    this.blockSameID = [[]];
    let row = board.length;
    let col = board[0].length;
    for (let i = 1; i < row - 1; ++i) {
      for (let j = 1; j < col - 1; ++j) {
        let block = board[i][j];
        if (block.blockType == 0) continue;

        this.blockSameID[block.blockType]
          ? this.blockSameID[block.blockType].push(block)
          : (this.blockSameID[block.blockType] = [block]);
      }
    }
    //console.log(this.blockSameID[0]);
  }

  public deleteBlockInListID(id: number, block: Block): void {
    this.blockSameID[id].some((ele, idx) => {
      if (ele.getRow() == block.getRow() && ele.getCol() == block.getCol()) {
        this.blockSameID[id].splice(idx, 1);
        this.idList[
          (block.getRow() - 1) * (this.col - 2) + (block.getCol() - 1)
        ] = 0;
        return;
      }
    });
  }

  public shuffleID() {
    let indexIDList = [];
    for (let i = 0; i < this.idList.length; ++i) {
      if (this.idList[i] != 0) {
        indexIDList.push(i);
      }
    }

    for (let i = 0; i < indexIDList.length; ++i) {
      let idx = Math.round(Math.random() * (indexIDList.length - 1));

      [this.idList[indexIDList[i]], this.idList[indexIDList[idx]]] = [
        this.idList[indexIDList[idx]],
        this.idList[indexIDList[i]],
      ];
    }
  }

  protected update(dt: number): void {}
}
