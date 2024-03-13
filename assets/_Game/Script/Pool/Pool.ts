import PoolMember from "./PoolMember";
import { PoolType } from "./SimplePool";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool {
  private parentNode: cc.Node;
  private prefab: PoolMember;
  private list: PoolMember[] = [];
  private activeList: PoolMember[] = [];

  public get poolType(): PoolType {
    return this.prefab.poolType;
  }

  constructor(prefab: PoolMember, parentNode: cc.Node, amount: number) {
    this.preload(prefab, parentNode, amount);
  }

  public preload(prefab: PoolMember, parentNode: cc.Node, amount: number) {
    this.prefab = cc.instantiate(prefab).getComponent(PoolMember);
    this.parentNode = parentNode;

    for (let i = 0; i < amount; i++) {
      let clone = cc.instantiate(this.prefab.node).getComponent(PoolMember);
      clone.node.active = false;
      this.parentNode.addChild(clone.node);

      this.list.push(clone);
    }
  }

  public spawn(pos: cc.Vec3, angle: number): PoolMember {
    let clone = null;
    if (this.list.length > 0) {
      clone = this.list.shift();
    } else {
      clone = cc.instantiate(this.prefab.node).getComponent(PoolMember);
      this.parentNode.addChild(clone.node);
    }

    clone.node.setWorldPosition(pos);
    clone.node.angle = angle;
    clone.node.active = true;

    this.activeList.push(clone);
    return clone;
  }

  public despawn(clone: PoolMember) {
    if (clone.node.active) {
      clone.node.active = false;
      this.list.push(clone);
    }
  }

  collect() {
    while (this.activeList.length > 0) {
      this.despawn(this.activeList.shift());
    }
  }
}
