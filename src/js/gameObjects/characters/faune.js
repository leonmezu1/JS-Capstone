/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';
import sceneEvents from '../../events/events';
import { Handler } from '../../Scenes/scenesHandler';
import { getSystemAudio } from '../../utils/localStorage';


let HealthState;
(function fauneHealth(HealthState) {
  HealthState[HealthState.IDLE = 0] = 'IDLE';
  HealthState[HealthState.DAMAGE = 1] = 'DAMAGE';
  HealthState[HealthState.DEAD = 2] = 'DEAD';
}(HealthState || (HealthState = {})));

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.chestItems = [];
    this.chestLog = {};
    this.damageTime = 0;
    this.gameLog = {};
    this.healthState = HealthState.IDLE;
    this.health = 600;
    this.knives = Phaser.Physics.Arcade.GROUP;
    this.knivesLifeSpan = 6000;
    this.activeChest = false;
    this.scene = scene;
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.score = 0;
    this.coins = 0;
    this.settedScale = 1;
    this.body.setSize(this.body.width * 0.2, this.body.height * 0.3);
    this.body.offset.y = 16;
    this.setDepth(500);
    this.characterType = 'Faune';
    this.anims.play('faune-idle-down');
    scene.add.existing(this);
  }

  setCharacterScale(scale) {
    this.settedScale = scale;
  }

  setChestLog(dataObject) {
    this.chestLog = dataObject;
  }

  setGameLog(dataObject) {
    this.gameLog = { ...this.gameLog, ...dataObject };
  }

  setScore(increment) {
    this.score += increment;
    sceneEvents.emit('player-score-changed', this.getScore());
  }

  setScoreNonIcremental(staticScore) {
    this.score = staticScore;
  }

  setHealth(health) {
    this.health = health;
    sceneEvents.emit('player-health-event', this.getHealth());
  }

  setKnives(knives) {
    this.knives = knives;
  }

  setChest(chest) {
    this.activeChest = chest;
  }

  getChestLog() {
    return this.chestLog;
  }

  getGameLog() {
    return this.gameLog;
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

  fauneDies() {
    this.scene.sound.stopAll();
    if (getSystemAudio().sounds) this.scene.sound.play('fauneDies');
    this.healthState = HealthState.DEAD;
    this.setTint(0xffffff);
    this.anims.play('faune-faint');
    this.body.setVelocity(0, 0);
    this.body.immovable = true;
    this.scene.cameras.main.fadeOut(2000, 0, 0, 0);
    this.scene.scene.stop(Handler.scenes.ui);
    const dataToPass = {
      score: this.getScore(),
      coins: this.getCoins(),
    };
    if (this.scene.scene.isActive('BattleUIScene')) this.scene.scene.stop('BattleUIScene');
    setTimeout(() => {
      if (this.scene.scene.isActive(Handler.scenes.battle)) {
        this.scene.scene.stop(Handler.scenes.battle);
      }
      this.scene.scene.start(Handler.scenes.gameOver, { dataToPass });
    }, 2100);
  }

  damagedBy(damage) {
    if (damage > -1) {
      this.health -= damage;
    }
    if (getSystemAudio().sounds) this.scene.sound.play('fauneHurt');
    sceneEvents.emit('player-damaged', this.getHealth());
  }

  incrementCoins(coins) {
    this.coins += coins;
    sceneEvents.emit('player-coins-changed', this.getCoins());
  }

  healedBy(hearts) {
    if (hearts > 0) {
      this.health += hearts * 100;
    }
    if (this.health > 600) this.health = 600;
    sceneEvents.emit('player-health-event', this.getHealth());
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
    knife.onWorldBounds = true;
    knife.setCollideWorldBounds(true);
    knife.setVelocity(velocityVector.x * 250, velocityVector.y * 250);
    knife.setRotation(angle + 1.5708);
    setTimeout(() => {
      knife.destroy();
    }, this.knivesLifeSpan);
    if (getSystemAudio().sounds) this.scene.sound.play('swing');
  }

  handleDamage(dx, dy, movementEnabled = true, damage = false) {
    if (this.healthState === HealthState.DAMAGE) { return; }
    if (movementEnabled) {
      const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
      this.setTint(0xff0000);
      this.setVelocity(dir.x, dir.y);
    }
    this.healthState = HealthState.DAMAGE;
    if (getSystemAudio().sounds) this.scene.sound.play('fauneHurt');
    if (damage !== false) {
      this.damagedBy(damage);
    } else {
      this.damagedBy(100);
    }
    if (this.health <= 0) {
      this.fauneDies();
    }
  }

  handleStaticDamage() {
    if (this.healthState === HealthState.DAMAGE) { return; }
    this.damagedBy(100);
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    if (this.health <= 0) {
      this.fauneDies();
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

    const scale = this.settedScale !== 1 ? this.settedScale : 1;

    const speed = 128;

    const leftDown = cursors.left.isDown;
    const rightDown = cursors.right.isDown;
    const upDown = cursors.up.isDown;
    const downDown = cursors.down.isDown;
    const spaceDown = Phaser.Input.Keyboard.JustDown(cursors.space);

    if (leftDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(-speed, 0);

      this.scaleX = -scale;
      this.body.offset.x = 20;
    } else if (rightDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(speed, 0);

      this.scaleX = scale;
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
        this.chestLog[this.activeChest.getID()] = 'opened';
      } else {
        this.throwKnife();
      }
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined;
    }
  }
}
