import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class UiScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.ui,
    });
  }
}