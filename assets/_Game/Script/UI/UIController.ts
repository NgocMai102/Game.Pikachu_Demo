// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Level } from "../Level/Level";
import ScreenStart from "./ScreenStart";
import ScreenPlay from "./ScreenPlay";
import PopUp from "../PopUp";

const { ccclass, property } = cc._decorator;

@ccclass("UIController")
export default class UIController extends cc.Component {
  @property(ScreenStart)
  private screenStart: ScreenStart = null;
  @property(ScreenPlay)
  private screenPlay: ScreenPlay = null;
  @property(cc.Node)
  private overLay: cc.Node = null;
  @property(PopUp)
  private screenEnd: PopUp = null;

  public static ins: UIController = null;

  onLoad() {
    UIController.ins = this;
    this.displayScreenStart();
  }

  // LIFE-CYCLE CALLBACKS:

  public resetScreen(): void {
    this.overLay.active = true;
    this.screenStart.node.active = false;
    this.screenPlay.node.active = false;
    this.screenEnd.node.active = false;
  }

  public displayScreenStart(): void {
    this.resetScreen();
    this.screenStart.node.active = true;
    this.screenStart.onInit();
  }

  public displayScreenPlay(): void {
    this.resetScreen();
    this.screenPlay.node.active = true;

    Level.ins.handleClickStart();
  }

  public displayScreenEnd(/*check: boolean*/): void {
    this.screenEnd.node.active = true;
    this.screenEnd.onInit();
  }
}
