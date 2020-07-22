import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = map.addTilesetImage('dungeon_tileset', 'dungeon_tile');

    map.createStaticLayer('Floor', tileset);
    const wallLayers = map.createStaticLayer('Walls', tileset);
    wallLayers.setCollisionByProperty({ collides: true });
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallLayers.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    const faune = this.add.sprite(150, 128, 'faune');

    this.anims.create({
      key: 'faune-idle-down',
      frames: [{ key: 'faune', frame: 'walk-down-3.png' }],
    });

    this.anims.create({
      key: 'faune-run-down',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-down-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: 'faune-run-up',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-up-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    });

    faune.anims.play('faune-run-up');
  }
}