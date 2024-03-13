// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Block from "../Block";
import FindPath from "./FindPath";
import { STATE } from "../GameConstant";
import Board from "./Board";
import SoundManager, { AudioType } from "../Manager/SoundManager";
import UIController from "../UI/UIController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController extends cc.Component {
  @property(Board)
  private board: Board = null;

  @property(cc.Graphics)
  private drawBoard: cc.Graphics = null;

  private findPath: FindPath = null;
  public static ins: BoardController = null;
  public static get Ins(): BoardController {
    return this.ins;
  }
  private blockWait: [Block, Block] = [null, null];

  onLoad(): void {
    this.findPath = new FindPath(this.board);
    BoardController.ins = this;
  }

  public checkBlock(block: Block): void {
    if (this.blockWait[0] == null) {
      this.blockWait[0] = block;
      return;
    } else if (this.blockWait[1] == null) {
      this.blockWait[1] = block;
    }
    if (
      this.blockWait[0].blockType == this.blockWait[1].blockType &&
      (this.blockWait[0].getCol() != this.blockWait[1].getCol() ||
        this.blockWait[0].getRow() != this.blockWait[1].getRow())
    ) {
      let type0 = this.blockWait[0].blockType;
      let type1 = this.blockWait[1].blockType;
      if (this.findPath.checkTwoPoint(this.blockWait[0], this.blockWait[1])) {
        this.soundSuccess();
        this.connectBlock(
          this.blockWait[0],
          this.blockWait[1],
          this.findPath.showPath()
        );

        this.deleteBlock(type0, type1);
        this.changeBlockState();
        if (this.checkWin()) {
          console.log("win");
        }
      } else {
        this.soundMiss();
        this.restartBlock();
      }
    } else {
      this.soundMiss();
      this.restartBlock();
    }
    this.blockWait = [null, null];
  }

  

  private changeBlockState() {
    this.blockWait[0].changeState(STATE.CLOSE);
    this.blockWait[1].changeState(STATE.CLOSE);
  }

  private restartBlock() {
    this.blockWait[0].resetState();
    this.blockWait[1].resetState();
  }

  private soundMiss(): void {
    SoundManager.Ins.playClip(AudioType.Miss);
  }

  private soundSuccess(): void {
    SoundManager.Ins.playClip(AudioType.Success);
  }

  private deleteBlock(type0: number, type1: number): void {
    this.board.deleteBlockInListID(type0, this.blockWait[0]);
    this.board.deleteBlockInListID(type1, this.blockWait[1]);
  }

  private checkWin(): boolean {
    for (let i = 0; i < this.board.idList.length; ++i) {
      if (this.board.idList[i] != 0) return false;
    }
    UIController.ins.displayScreenEnd();
    return true;
  }

  private connectBlock(block1: Block, block2: Block, pathSave: Block[]): void {
    this.drawLine(block1.getPosition(), pathSave[0].getPosition());
    for (let i = 0; i < pathSave.length; ++i) {
      for (let j = i + 1; j < pathSave.length; ++j) {
        this.drawLine(pathSave[i].getPosition(), pathSave[j].getPosition());
      }
    }
    this.drawLine(
      pathSave[pathSave.length - 1].getPosition(),
      block2.getPosition()
    );
  }

  private drawLine(b1: cc.Vec3, b2: cc.Vec3) {
    this.drawBoard.lineCap = cc.Graphics.LineCap.ROUND;
    this.drawBoard.lineJoin = cc.Graphics.LineJoin.MITER;
    this.drawBoard.moveTo(b1.x, b1.y);
    this.drawBoard.lineTo(b2.x, b2.y);
    this.drawBoard.stroke();
    this.scheduleOnce(function () {
      this.drawBoard.clear();
    }, 0.1);
  }

  public refreshBlocks() {
    this.board.shuffleID();
    let index = 0;
    for (let i = 0; i < this.board.matrixBlock.length; ++i) {
      for (let j = 0; j < this.board.matrixBlock[0].length; ++j) {
        if (this.board.matrixBlock[i][j].blockType == 0) continue;
        this.board.matrixBlock[i][j].setBlockType(this.board.idList[index++]);
      }
    }
  }

  private getSuggestBlock(listBlock: Block[]) {
    for (let i = 0; i < this.board.matrixBlock.length; ++i) {
      for (let j = i + 1; j < this.board.matrixBlock[i].length; ++j) {
        this.blockWait = [listBlock[i], listBlock[j]];
        if (this.findPath.checkTwoPoint(listBlock[i], listBlock[j])) {
          return true;
        }
      }
    }
    return false;
  }

  public suggetBlock() {
    for (const key of Object.keys(this.board.blockSameID)) {
      let listBlock = this.board.blockSameID[key];
      if (listBlock.length == 0) continue;
      if (this.getSuggestBlock(listBlock)) {
        return;
      }
    }
    this.refreshBlocks();
    this.suggetBlock();
  }
}
