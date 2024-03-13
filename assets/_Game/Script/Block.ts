import PoolMember from "./Pool/PoolMember";
import { STATE, BlockType } from "./GameConstant";
import Utilities from "./Utilities";
import BoardController from "./Board/BoardController";

// import GridSystem from "./Grid/GridSystem";

const { ccclass, property } = cc._decorator;

@ccclass("Block")
export default class Block extends PoolMember {
  // @property(cc.Sprite)
  // private sprite: cc.Sprite = null;

  private row: number = 0;
  private col: number = 0;
  private x: number = 0;
  private y: number = 0;
  private up: Block = null;
  private down: Block = null;
  private left: Block = null;
  private right: Block = null;
  public state: STATE = STATE.OPEN;

  //public img: Image = null;
  @property(cc.Node)
  private clickable: cc.Node = null;

  @property(cc.Sprite)
  private img: cc.Sprite = null;

  @property(Array(cc.SpriteFrame))
  private listSprite: cc.SpriteFrame[] = [];
  public blockType: BlockType;

  private getSprite(blockType: BlockType): cc.SpriteFrame {
    return this.listSprite[blockType as number];
  }

  public setBlockType(blockType: BlockType) {
    this.blockType = blockType;
    this.img.spriteFrame = this.getSprite(blockType);
  }

  //getter
  public getX(): number {
    return this.node.getPosition().x;
  }
  public getY(): number {
    return this.node.getPosition().y;
  }
  public getState(): STATE {
    return this.state;
  }
  public getRow(): number {
    return this.row;
  }
  public getCol(): number {
    return this.col;
  }

  //setter
  public setState(state: STATE): void {
    this.state = state;
    this.handleState(state);
  }

  public setRow(row: number): void {
    this.row = row;
  }
  public setCol(col: number): void {
    this.col = col;
  }
  public setRowCol(row: number, col: number): void {
    this.row = row;
    this.col = col;
  }
  public setPos(x: number, y: number): void {
    this.node.setPosition(cc.v3(x, y, 0));
  }

  public changeState(state: STATE): void {
    this.state = state;
    this.handleState(state);
  }

  public resetState(): void {
    this.state = STATE.OPEN;
    this.handleState(this.state);
  }

  private handleState(state: STATE): void {
    if (state === STATE.OPEN) {
      this.node.active = true;
      this.node.color = cc.color(255, 255, 255);
    } else if (state === STATE.WAIT) {
      this.node.color = cc.color(122, 122, 255);
    } else if (state == STATE.CLOSE) {
      this.blockType = 0;
      this.node.active = false;
    }
  }

  public getPosition(): cc.Vec3 {
    return cc.v3(this.node.getPosition().x, this.node.getPosition().y, 0);
  }

  protected onTouchBegan(event: cc.Event.EventTouch): void {
    if (this.state === STATE.OPEN) {
      this.changeState(STATE.WAIT);
      BoardController.Ins.checkBlock(this);
    } else if (this.state === STATE.WAIT) {
      this.changeState(STATE.OPEN);
      BoardController.Ins.checkBlock(this);
    }
  }

  public actionSuggest(): void {
    this.node.color = cc.color(122, 122, 255);
  }

  private initBlock() {
    if (this.blockType == 0) {
      this.node.active = false;
    }
  }

  public resetBlock() {
    this.node.active = true;
    this.blockType = 0;
  }

  onLoad() {
    this.initBlock();
    //this.clickable.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
  }
}
