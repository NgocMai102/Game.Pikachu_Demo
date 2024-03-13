const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewManager extends cc.Component {
  private static ins: ViewManager = null;
  public static get Ins(): ViewManager {
    return this.ins;
  }

  public width: number = 0;
  public height: number = 0;

  @property
  public spaceUnder: number = 0;

  @property
  public spaceAbove: number = 0;

  @property
  public spaceLeft: number = 0;

  @property
  public spaceRight: number = 0;

  protected onLoad(): void {
    ViewManager.ins = this;
    this.getSize();
  }

  private getSize() {
    this.width = cc.view.getVisibleSize().width;
    this.height = cc.view.getVisibleSize().height;
  }
}
