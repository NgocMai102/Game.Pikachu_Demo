// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Level } from "./Level/Level";
import UIController from "./UI/UIController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopUp extends cc.Component {
  @property(cc.Button)
  private btnHome: cc.Button = null;

  @property(cc.Button)
  private btnReplay: cc.Button = null;

  onLoad(): void {
    this.btnHome.node.on(
      cc.Node.EventType.TOUCH_START,
      this.handleBtnHome,
      this.btnHome
    );
    this.btnReplay.node.on(
      cc.Node.EventType.TOUCH_START,
      this.handleBtnReplay,
      this.btnReplay
    );
  }

  public onInit() {
    this.btnHome.node.active = true;
    this.btnReplay.node.active = true;
  }

  private handleBtnHome(event: cc.Event.EventTouch) {
    this.scheduleOnce(function () {
      this.node.active = false;
      UIController.ins.displayScreenStart();
    }, 0.4);
  }

  private handleBtnReplay(event: cc.Event.EventTouch) {
    this.scheduleOnce(function () {
      this.node.active = false;
      UIController.ins.displayScreenPlay();
      Level.ins.handleClickRePlay();
    }, 0.4);
  }
}
