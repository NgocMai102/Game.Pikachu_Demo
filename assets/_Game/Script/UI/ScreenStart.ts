// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import UIController from "./UIController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenStart extends cc.Component {
  @property(cc.Button)
  public btnPlay: cc.Button = null;

  onLoad(): void {
    this.btnPlay.node.on(
      cc.Node.EventType.TOUCH_START,
      this.handleBtnPlay,
      this.btnPlay
    );
  }

  public onInit() {
    this.btnPlay.node.active = true;
  }

  private handleBtnPlay(event: cc.Event.EventTouch) {
    this.scheduleOnce(function () {
      this.node.active = false;
      UIController.ins.displayScreenPlay();
    }, 0.4);
  }
}
