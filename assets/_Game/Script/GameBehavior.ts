// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBehaviour extends cc.Component {
  protected onLoad(): void {
    this.loadComponent();
  }

  protected start(): void {}

  protected onReset(): void {
    this.loadComponent();
    this.resetValue();
  }

  protected loadComponent(): void {}

  protected resetValue(): void {}
  protected onEnable(): void {}
  protected onDisable(): void {}

  // update (dt) {}
}
