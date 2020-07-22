import { Scene } from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }

  preload() {
    this.load.image('dungeon_tile', 'assets/sprites/0x72_DungeonTilesetII_v1.3_extruded.png');
    this.load.image('full_heart', 'assets/public/ui/ui_heart_full.png');
    this.load.image('half_heart', 'assets/public/ui/ui_heart_half.png');
    this.load.image('empty_heart', 'assets/public/ui/ui_empty_full.png');
    this.load.tilemapTiledJSON('dungeon_map', 'assets/maps/dungeon.json');
    this.load.atlas('faune', 'assets/public/character/fauna.png', 'assets/public/character/fauna.json');
    this.load.atlas('lizard', 'assets/public/enemies/lizard.png', 'assets/public/enemies/lizard.json');
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
