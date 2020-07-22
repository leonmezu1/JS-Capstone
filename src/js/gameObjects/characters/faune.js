import Phaser from 'phaser';

let HealthState;
(function fauneHealth(HealthState) {
  HealthState[HealthState.IDLE = 0] = 'IDLE';
  HealthState[HealthState.DAMAGE = 1] = 'DAMAGE';
  HealthState[HealthState.DEAD = 2] = 'DEAD';
}(HealthState || (HealthState = {})));

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.healthState = HealthState.IDLE;
    this.damageTime = 0;
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setSize(this.body.width * 0.5, this.body.height * 0.8);
    scene.add.existing(this);
  }

  handleDamage(dx, dy) {
    if (this.healthState === HealthState.DAMAGE) { return; }
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.setTint(0xff0000);
    this.setVelocity(dir.x, dir.y);
    this.healthState = HealthState.DAMAGE;
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 200) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
      default:
        break;
    }
  }

  update(cursors) {
    if (!cursors) { return; }

    const speed = 128;
    if (cursors.right.isDown === true) {
      this.setVelocityX(speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    }

    if (cursors.up.isDown === true) {
      this.setVelocityY(-speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    }

    if (cursors.down.isDown === true) {
      this.setVelocityY(speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    }

    if (cursors.left.isDown === true) {
      this.setVelocityX(-speed, 0);
      this.scaleX = -1;
      this.body.offset.x = 24;
    }
    if (cursors.left.isUp && cursors.right.isUp) {
      this.setVelocityX(0);
    }
    if (cursors.up.isUp && cursors.down.isUp) {
      this.setVelocityY(0);
    }
    if (this.body.velocity.x > 0) {
      this.play('faune-run-side', true);
    } else if (this.body.velocity.x < 0) {
      this.play('faune-run-side', true);
    }

    if (this.body.velocity.y < 0 && this.body.velocity.x === 0) {
      this.play('faune-run-up', true);
    } else if (this.body.velocity.y > 0 && this.body.velocity.x === 0) {
      this.play('faune-run-down', true);
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.scaleX = 1;
      this.play('faune-idle-down', true);
      this.body.offset.x = 8;
    }
  }
}
