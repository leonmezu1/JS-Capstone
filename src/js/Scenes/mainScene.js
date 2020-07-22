import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);

    map.createStaticLayer('Floor', tileset);
    const wallLayers = map.createStaticLayer('Walls', tileset);
    wallLayers.setCollisionByProperty({ collides: true });
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallLayers.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    this.lizard = this.physics.add.sprite(640, 280, 'lizard');

    this.faune = this.physics.add.sprite(600, 280, 'faune');

    this.anims.create({
      key: 'faune-idle-down',
      frames: [{ key: 'faune', frame: 'walk-down-3.png' }],
    });

    this.anims.create({
      key: 'faune-idle-up',
      frames: [{ key: 'faune', frame: 'walk-up-3.png' }],
    });

    this.anims.create({
      key: 'faune-idle-side',
      frames: [{ key: 'faune', frame: 'walk-side-3.png' }],
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

    this.anims.create({
      key: 'faune-run-side',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-side-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: 'lizard-idle',
      frames: this.anims.generateFrameNames('lizard', {
        start: 0,
        end: 3,
        prefix: 'lizard_m_idle_anim_f',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: 'lizard-run',
      frames: this.anims.generateFrameNames('lizard', {
        start: 0,
        end: 3,
        prefix: 'lizard_m_run_anim_f',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.faune.anims.play('faune-idle-down');
    this.lizard.anims.play('lizard-idle');
    this.physics.add.collider(this.faune, wallLayers);
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    this.cameras.main.startFollow(this.faune, true);
  }

  update(time, delta) {
    if (!this.cursors || !this.faune) { return; }

    const speed = 128;
    if (this.cursors.right.isDown === true) {
      this.faune.setVelocityX(speed, 0);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    }

    if (this.cursors.up.isDown === true) {
      this.faune.setVelocityY(-speed, 0);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    }

    if (this.cursors.down.isDown === true) {
      this.faune.setVelocityY(speed, 0);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    }

    if (this.cursors.left.isDown === true) {
      this.faune.setVelocityX(-speed, 0);
      this.faune.scaleX = -1;
      this.faune.body.offset.x = 24;
    }
    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.faune.setVelocityX(0);
    }
    if (this.cursors.up.isUp && this.cursors.down.isUp) {
      this.faune.setVelocityY(0);
    }
    if (this.faune.body.velocity.x > 0) {
      this.faune.play('faune-run-side', true);
    } else if (this.faune.body.velocity.x < 0) {
      this.faune.play('faune-run-side', true);
    }

    if (this.faune.body.velocity.y < 0 && this.faune.body.velocity.x === 0) {
      this.faune.play('faune-run-up', true);
    } else if (this.faune.body.velocity.y > 0 && this.faune.body.velocity.x === 0) {
      this.faune.play('faune-run-down', true);
    }

    if (this.faune.body.velocity.x === 0 && this.faune.body.velocity.y === 0) {
      this.faune.scaleX = 1;
      this.faune.play('faune-idle-down', true);
      this.faune.body.offset.x = 8;
    }
  }
}