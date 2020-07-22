import { Scene, Math } from 'phaser';
import { Handler } from './scenesHandler';
import Palas from '../gameObjects/palas';
import Bola from '../gameObjects/bola';

export default class MainScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
  }

  create() {}

  update() {}
}