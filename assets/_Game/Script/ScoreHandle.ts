//import { _decorator, Component, Node, Label, ProgressBar, Sprite, SpriteFrame, UIOpacity, Prefab, instantiate } from 'cc';
//import { PopupResult } from './PopupResult';
import UIController from "./UI/UIController";
const { ccclass, property } = cc._decorator;

@ccclass("ScoreHandle")
export class ScoreHandle extends cc.Component {
  @property(cc.Label)
  time: cc.Label = null;
  @property(cc.Label)
  score: cc.Label = null;
  // @property(UIOpacity)
  // stars: UIOpacity[] = [];
  @property(cc.ProgressBar)
  pBar: cc.ProgressBar = null;
  //   @property(cc.Prefab)
  //   popupResult: cc.Prefab = null;

  public static instance: ScoreHandle = null;
  private timeDefault = 1200;

  onLoad() {
    ScoreHandle.instance = this;
  }

  start() {
    //console.log("Start Game 2")
    this.startGame();
  }

  public changeTime(timeSeconds: number) {
    let minute: string | number = Math.floor(timeSeconds / 60);
    let second: string | number = timeSeconds % 60;
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }

    this.time.string = minute + ": " + second;
    this.pBar.progress = timeSeconds / this.timeDefault;
    //this.changeScore(timeSeconds);
  }

  public changeScore(timeSeconds: number) {
    let _score = Math.ceil((timeSeconds * 100) / this.timeDefault);
    this.score.string = _score.toString();
  }

  private startGame() {
    this.resertPBar();
    let _timeTmp = this.timeDefault;
    const countDown = function () {
      if (_timeTmp === 0) {
        this.displayPopupLose();
        this.unscheduleAllCallbacks(countDown);
      }
      this.changeTime(_timeTmp--);
    };

    this.schedule(countDown, 1);
  }

  private resertPBar() {
    this.time.string = "00:00";
    this.score.string = "0";
    this.pBar.progress = 1;
  }

  public setTimeDefault(time: number) {
    this.timeDefault = time;
    this.startGame();
  }

  update(deltaTime: number) {}
}
