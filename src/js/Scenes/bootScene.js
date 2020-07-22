import { Scene } from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('left', 'assets/left_pallete.png');
    this.load.image('right', 'assets/right_pallete.png');
    this.load.image('separator', 'assets/separator.png');
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
      },
    });
    this.load.on('progress', percent => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
    });
    this.load.on('complete', () => {
      setTimeout(() => {
        this.scene.start(Handler.scenes.main);
      }, 1000);
    });
  }
}
