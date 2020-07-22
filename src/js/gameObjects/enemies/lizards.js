import Phaser from 'phaser';

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
export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.direction = Direction.RIGHT;
    this.anims.play('lizard-idle');
    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this,
    );
    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  destroy(fromScene) {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  handleTileCollision(go, tile) {
    if (go !== this) {
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
      default:
        break;
    }
  }
}
