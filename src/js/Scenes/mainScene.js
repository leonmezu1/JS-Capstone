import { Scene, Math } from 'phaser';
import { Handler } from './scenesHandler';

export default class MainScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
  }

  create() {}

  update() {}
}