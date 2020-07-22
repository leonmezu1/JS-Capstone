import { Scene } from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }

  preload() {
    this.load.image('dungeon_tile', 'assets/sprites/0x72_DungeonTilesetII_v1.3.png');
    this.load.tilemapTiledJSON('dungeon_map', 'assets/maps/dungeon.json');
    this.load.atlas('faune', 'assets/public/character/fauna.png', 'assets/public/character/fauna.json');
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
