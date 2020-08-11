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
export default class Ogres extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.direction = Direction.RIGHT;
    this.anims.play('ogre-idle');
    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this,
    );
    this.moveEvent = scene.time.addEvent({
      delay: 4000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setSize(this.body.width * 0.5, this.body.height * 0.4);
    this.body.offset.y = 12;
    this.health = 375;
    scene.add.existing(this);
  }

  decreaseHealth(damage) {
    this.health -= damage;
    if (getSystemAudio().sounds) this.scene.sound.play('enemyHit');
  }

  destroy(fromScene) {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  destroyMovement() {
    this.direction = 'steady';
    this.moveEvent.destroy();
  }

  handleTileCollision(gO) {
    if (gO !== this) {
      return;
    }
    this.direction = randomDirection(this.direction);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    const speed = 50;
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
      this.destroy();
    }
  }
}
