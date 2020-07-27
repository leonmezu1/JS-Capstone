import Phaser from 'phaser';
import sceneEvents from '../../events/events';


let HealthState;
(function fauneHealth(HealthState) {
  HealthState[HealthState.IDLE = 0] = 'IDLE';
  HealthState[HealthState.DAMAGE = 1] = 'DAMAGE';
  HealthState[HealthState.DEAD = 2] = 'DEAD';
}(HealthState || (HealthState = {})));

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.damageTime = 0;
    this.healthState = HealthState.IDLE;
    this.health = 600;
    this.knives = Phaser.Physics.Arcade.GROUP;
    this.activeChest = Phaser.Physics.Arcade.GROUP;
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.score = 0;
    this.coins = 0;
    this.chestItems = [];
    this.body.setSize(this.body.width * 0.3, this.body.height * 0.3);
    this.body.offset.y = 16;
    scene.add.existing(this);
  }

  getCoins() {
    return this.coins;
  }

  getScore() {
    return this.score;
  }

  getHealth() {
    return this.health;
  }

  damagedBy(damage) {
    if (damage > -1) {
      this.health -= damage;
    }
  }

  setScore(increment) {
    this.score += increment;
  }

  incrementCoins(coins) {
    this.coins += coins;
  }

  healedBy(hearts) {
    if (hearts > -1) {
      this.health += hearts * 100;
    }

    if (this.health > 600) this.health = 600;
  }

  setKnives(knives) {
    this.knives = knives;
  }

  setChest(chest) {
    this.activeChest = chest;
  }

  throwKnife() {
    if (!this.knives) return;
    if (!this.anims.currentAnim) return;

    const parts = this.anims.currentAnim.key.split('-');
    const direction = parts[2];
    const velocityVector = new Phaser.Math.Vector2(0, 0);

    switch (direction) {
      case 'up':
        velocityVector.y = -1;
        break;
      case 'down':
        velocityVector.y = 1;
        break;
      case 'side':
        if (this.scaleX < 0) {
          velocityVector.x = -1;
        } else {
          velocityVector.x = 1;
        }
        break;
      default:
        break;
    }

    const angle = velocityVector.angle();
    const knife = this.knives.get(this.x + velocityVector.x * 16, this.y + velocityVector.y * 16, 'knife');
    knife.setVelocity(velocityVector.x * 250, velocityVector.y * 250);
    knife.setRotation(angle + 1.5708);
  }

  handleDamage(dx, dy) {
    if (this.healthState === HealthState.DAMAGE) { return; }
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.setTint(0xff0000);
    this.setVelocity(dir.x, dir.y);
    this.healthState = HealthState.DAMAGE;
    this.damagedBy(100);
    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0xffffff);
      this.anims.play('faune-faint');
      this.body.setVelocity(0, 0);
      this.body.immovable = true;
    }
  }

  handleStaticDamage() {
    if (this.healthState === HealthState.DAMAGE) { return; }
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    this.damagedBy(100);
    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0xffffff);
      this.anims.play('faune-faint');
      this.body.setVelocity(0, 0);
      this.body.immovable = true;
    }
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
    if (this.healthState === HealthState.DEAD) {
      return;
    }

    const speed = 128;

    const leftDown = cursors.left.isDown;
    const rightDown = cursors.right.isDown;
    const upDown = cursors.up.isDown;
    const downDown = cursors.down.isDown;
    const spaceDown = cursors.space.isDown;

    if (leftDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(-speed, 0);

      this.scaleX = -1;
      this.body.offset.x = 20;
    } else if (rightDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(speed, 0);

      this.scaleX = 1;
      this.body.offset.x = 12;
    } else if (upDown) {
      this.anims.play('faune-run-up', true);
      this.setVelocity(0, -speed);
    } else if (downDown) {
      this.anims.play('faune-run-down', true);
      this.setVelocity(0, speed);
    } else if (this.anims.currentAnim) {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }

    if (spaceDown) {
      if (this.activeChest) {
        this.chestItems = this.activeChest.open();
        this.incrementCoins(this.chestItems[0]);
        this.healedBy(this.chestItems[1]);
        this.chestItems = [];
        sceneEvents.emit('player-coins-changed', this.getCoins());
        sceneEvents.emit('player-healed', this.getHealth());
      } else {
        this.throwKnife();
      }
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined;
    }
  }
}
