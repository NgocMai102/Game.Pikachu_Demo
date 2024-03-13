// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolMember from "./PoolMember";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolAmount {
  @property(cc.Node)
  public root: cc.Node = null;

  @property(cc.Prefab)
  public prefab: PoolMember = null;

  @property(cc.Integer)
  public amount: number = 0;
}
