/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';
import { getSystemAudio } from '../../utils/localStorage';

let Direction;
(function directioner(Direction) {
  Direction[Direction.UP = 0] = 'UP';
  Direction[Direction.DOWN = 1] = 'DOWN';
  Direction[Direction.LEFT = 2] = 'LEFT';
  Direction[Direction.RIGHT = 3] = 'RIGHT';
}(Direction || (Direction = {})));

const randomDirection = (exclude) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return newDirection;
};
export default class Dragon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.direction = Direction.RIGHT;
    this.anims.play('dragon-up');
    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this,
    );
    this.moveEvent = scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setSize(this.body.width * 0.20, this.body.height * 0.15);
    this.body.offset.y = 65;
    this.characterType = 'Dragon';
    this.health = 1000;
    scene.add.existing(this);
  }

  decreaseHealth(damage) {
    this.health -= damage;
    if (getSystemAudio().sounds) this.scene.sound.play('enemyHit');
  }

  checkHealth() {
    if (this.health <= 0) {
      if (getSystemAudio().sounds) this.scene.sound.play('enemyDies');
      this.destroy();
    }
  }

  destroy(fromScene) {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  destroyMovement() {
    this.direction = 'steady';
    this.moveEvent.destroy();
  }

  enableMovement() {
    this.direction = Direction.RIGHT;
    this.moveEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  handleTileCollision(gO) {
    if (gO !== this) {
      return;
    }
    this.direction = randomDirection(this.direction);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    const speed = 200;
    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;
      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
      case 'steady':
        this.setVelocity(0, 0);
        break;
      default:
        break;
    }

    if (this.health <= 0) {
      if (getSystemAudio().sounds) this.scene.sound.play('enemyDies');
      if (getSystemAudio().music === true) this.scene.sound.stopAll();
      if (getSystemAudio().music) this.scene.sound.play('town_music', { volume: 0.175 });
      this.destroy(true);
    }
  }
}