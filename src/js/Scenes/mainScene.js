import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Lizards from '../gameObjects/enemies/lizards';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import Faune from '../gameObjects/characters/faune';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
    this.hit = 0;
  }

  handlePlayerLizardCollision(obj1, obj2) {
    const lizard = obj2;
    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.faune.setVelocity(dir.x, dir.y);
    this.hit = 1;
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

    this.faune = new Faune(this, 350, 400, 'faune');

    const lizards = this.physics.add.group({
      classType: Lizards,
      createCallback: (go) => {
        const lizGo = go;
        lizGo.body.onCollide = true;
      },
    });

    lizards.get(660, 280, 'lizard');
    this.physics.add.collider(this.faune, wallLayers);
    this.physics.add.collider(lizards, wallLayers);
    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this,
    );
    this.cameras.main.startFollow(this.faune, true);
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    if (this.hit > 0) {
      this.hit += 1;
      if (this.hit > 7) this.hit = 0;
      return;
    }
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