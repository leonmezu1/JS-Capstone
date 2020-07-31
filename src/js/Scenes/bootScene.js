import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }


  preload() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
    this.load.image('dungeon_tile', 'assets/sprites/0x72_DungeonTilesetII_v1.3_extruded.png');
    this.load.image('town_tile', 'assets/sprites/Overworld_extruded.png');
    this.load.image('room_tile', 'assets/sprites/Inner_extruded.png');
    this.load.image('full_heart', 'assets/public/ui/ui_heart_full.png');
    this.load.image('half_heart', 'assets/public/ui/ui_heart_half.png');
    this.load.image('empty_heart', 'assets/public/ui/ui_heart_empty.png');
    this.load.image('knife', 'assets/public/weapons/weapon_knife.png');
    this.load.atlas('lava', 'assets/sprites/lavafountain.png', 'assets/sprites/lavafountain_atlas.json');
    this.load.atlas('pikes', 'assets/sprites/pikes.png', 'assets/sprites/pikes_atlas.json');
    this.load.atlas('treasure', 'assets/public/items/treasure.png', 'assets/public/items/treasure.json');
    this.load.atlas('faune', 'assets/public/character/fauna.png', 'assets/public/character/fauna.json');
    this.load.atlas('lizard', 'assets/public/enemies/lizard.png', 'assets/public/enemies/lizard.json');
    this.load.tilemapTiledJSON('dungeon_map', 'assets/maps/dungeon.json');
    this.load.tilemapTiledJSON('town_map', 'assets/maps/town.json');
    this.load.tilemapTiledJSON('fauneRoom_map', 'assets/maps/fauneHouse.json');
    this.load.tilemapTiledJSON('topRightHouse_map', 'assets/maps/topRightHouse.json');
    this.load.tilemapTiledJSON('bottomLeftHouse_map', 'assets/maps/bottomLeftHouse.json');
    this.load.tilemapTiledJSON('bottomRightHouse_map', 'assets/maps/bottomRightHouse.json');
    this.load.plugin('DialogModalPlugin', 'js/plugins/dialogPlugin.js');


    this.loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
        alpha: 0.5,
      },
    });
    this.loadingBarBox = this.add.graphics({
      fillStyle: {
        color: 0x222222,
        alpha: 0.8,
      },
      fillRect: {
        color: 0xf0ffff,
      },
    });

    this.loadingText = this.make.text({
      x: this.width / 2 - 180,
      y: 10,
      text: 'Loading game assets',
      style: {
        font: '16px Arial',
        fill: '#ffffff',
      },
    });

    this.percentageText = this.make.text({
      x: this.width / 2 - 15,
      y: this.height * (5 / 6) + 15,
      text: '0%',
      style: {
        font: '20px Arial',
        fill: '#000000',
      },
    });

    this.assetsText = this.make.text({
      x: this.width / 2,
      y: 10,
      text: '',
      style: {
        font: '16px Arial',
        fill: '#ffffff',
      },
    });

    const texts = [this.loadingText, this.percentageText, this.assetsText];

    texts.forEach(text => {
      text.setOrigin(0, 0);
    });

    this.load.on('progress', percentage => {
      this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1);
      this.loadingBar.fillRect(0, this.height * (7 / 8), this.width * percentage, 50);
      this.percentageText.setText(`${parseInt(percentage * 100, 10)}%`);
    });

    this.load.on('fileprogress', (file) => {
      this.assetsText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on('complete', () => {
      setTimeout(() => {
        this.loadingBar.destroy();
        this.loadingBarBox.destroy();
        this.loadingText.destroy();
        this.percentageText.destroy();
        this.assetsText.destroy();
        this.scene.start(Handler.scenes.fauneRoom);
      }, 2500);
    });
  }
}
