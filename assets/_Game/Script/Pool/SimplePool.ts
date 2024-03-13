// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolMember from "./PoolMember";
import Pool from "./Pool";
const { ccclass, property } = cc._decorator;

export enum PoolType {
  None = 0,
  Block = 1,
}

@ccclass
export default class SimplePool {
  //trong scene sẽ cần tạo một node và add poolcontrol vào
  //list pool control được dùng để khởi tạo số lượng item tương ứng
  //prefab nào muốn dùng pool sẽ phải kế thừa poolmember
  //định nghĩa item đó bằng pooltype

  private static link: Map<PoolType, Pool> = new Map<PoolType, Pool>();

  //getter
  static isHasPool(poolType: PoolType): boolean {
    return this.link.has(poolType);
  }

  //setter
  static newPool(poolType: PoolType, pool: Pool): void {
    this.link.set(poolType, pool);
  }

  //setter
  static getPool(poolType: PoolType): Pool {
    return this.link.get(poolType);
  }

  public static preload(
    prefab: PoolMember,
    parentNode: cc.Node,
    amount: number
  ) {
    let pool = new Pool(prefab, parentNode, amount);
    if (!this.isHasPool(pool.poolType)) {
      this.newPool(pool.poolType, pool);
    }
  }

  static spawn(
    nodeType: PoolType,
    pos: cc.Vec3,
    angle: number = 0
  ): PoolMember {
    if (!this.isHasPool(nodeType))
      console.error(" NEED PRELOAD POOL : " + nodeType + "!!!");
    return this.getPool(nodeType).spawn(pos, angle);
  }

  static spawnT<T>(nodeType: PoolType, pos: cc.Vec3, angle: number): T {
    return this.spawn(nodeType, pos, angle) as T;
  }

  static despawn(clone: PoolMember) {
    this.getPool(clone.poolType).despawn(clone);
  }

  static collect(nodeType: PoolType) {
    this.getPool(nodeType).collect();
  }

  static collectAll() {
    const PoolTypeValue = Array.from(this.link.keys());

    PoolTypeValue.forEach((typeValue) => {
      this.collect(typeValue as number);
    });
  }
}
