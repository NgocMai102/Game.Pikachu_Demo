// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum AudioType {
  Background = 0,
  Miss = 1,
  Success = 2,
}

@ccclass
export default class SoundManager extends cc.Component {
  private static ins: SoundManager;
  public static get Ins(): SoundManager {
    return SoundManager.ins;
  }

  onLoad() {
    SoundManager.ins = this;
  }

  //----------------------------------------

  @property([cc.AudioClip])
  clips: cc.AudioClip[] = [];

  private audies: cc.AudioSource[] = [];

  protected start(): void {
    for (let i = 0; i < this.clips.length; i++) {
      let aud = this.node.addComponent(cc.AudioSource);
      aud.clip = this.clips[i];
      this.audies.push(aud);
    }
  }

  public playClip(type: AudioType): void {
    this.audies[type].play();
  }
}
