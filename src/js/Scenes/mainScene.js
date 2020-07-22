import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Lizards from '../gameObjects/enemies/lizards';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';

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

    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    const map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);

    map.createStaticLayer('Floor', tileset);
    const wallLayers = map.createStaticLayer('Walls', tileset);

    wallLayers.setCollisionByProperty({ collides: true });

    debugDraw(wallLayers, this);

    this.lizard = this.physics.add.sprite(640, 280, 'lizard');

    this.faune = this.physics.add.sprite(600, 280, 'faune');

    this.faune.anims.play('faune-idle-down');
    this.lizard.anims.play('lizard-idle');
    this.physics.add.collider(this.faune, wallLayers);
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    this.cameras.main.startFollow(this.faune, true);
  }

  // eslint-disable-next-line no-unused-vars
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