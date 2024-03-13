// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Board from "../Board/Board";
import { ScoreHandle } from "../ScoreHandle";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class Level extends cc.Component {
  @property(Board)
  protected board: Board = null;

  @property(ScoreHandle)
  private scoreHandle: ScoreHandle = null;

  public static ins: Level = null;

  protected onLoad(): void {
    Level.ins = this;
  }

  public handleClickStart() {
    this.board.node.active = true;
    this.scoreHandle.node.active = true;
  }

  public handleClickRePlay() {
    this.board.node.active = true;
    this.board.resetBlock();
  }
}
