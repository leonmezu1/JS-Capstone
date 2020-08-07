import Phaser from 'phaser';
import Faune from '../gameObjects/characters/faune';
import Lizards from '../gameObjects/enemies/lizards';
import Necromancers from '../gameObjects/enemies/necromancers';
import Ogres from '../gameObjects/enemies/ogres';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import necromancerAnims from '../gameObjects/anims/necromancerAnims';
import ogreAnims from '../gameObjects/anims/ogreAnims';
import sceneEvents from '../events/events';
import promptMessage from '../utils/messagesHelper';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BattleScene',
    });
    this.turn = 0;
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initHealth = data.dataToPass.health;
      this.enemyType = data.dataToPass.enemyType;
      this.parentScene = data.dataToPass.parentScene;
    } else {
      this.dataProvided = false;
    }
  }

  handleKnifeEnemyCollision(object1, object2) {
    object2.destroy();
    object1.decreaseHealth(75);
    this.enemy.setTint(0xff0000);
    setTimeout(() => {
      this.enemy.setTint(0xffffff);
    }, 100);
    this.faune.setScore(50);
  }


  receivePlayerSelection(action) {
    if (action === 'attack') {
      this.turn = 0;
      const duration = 1000;
      this.timeline = this.tweens.createTimeline();
      this.timeline.add({
        targets: this.faune,
        ease: 'Power1',
        x: this.enemy.body.x + 90,
        y: this.enemy.body.y + 10,
        duration,
        onStart: () => { this.faune.scaleX = -1.75; this.faune.anims.play('faune-run-side'); },
      });
      this.timeline.add({
        targets: this.faune,
        ease: 'Power1',
        x: 300,
        y: 110,
        onStart: () => { this.faune.throwKnife(); this.faune.scaleX = 1.75; this.faune.anims.play('faune-run-side'); },
        onComplete: () => { this.faune.anims.play('faune-idle-down'); this.faune.setVelocity(0); },
        duration,
      });
      this.timeline.play();
      promptMessage(
        [`Faune attacks ${this.enemyType} with 75 damage power`],
        2000,
        this,
      );
      this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
    }
  }

  nextTurn() {
    this.turn += 1;
    if (this.units[this.index] instanceof Faune) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      if (!this.enemy.body || !this.enemy) {
        promptMessage(
          [`${this.enemyType} has been defeated`],
          2000,
          this,
        );
        const health = this.faune.getHealth();
        this.wakeData = {
          score: this.faune.getScore(),
          health,
        };
        this.time.addEvent({
          delay: 2500,
          callback: () => {
            this.scene.stop('BattleUIScene');
            this.scene.sleep(this);
            setTimeout(() => {
              sceneEvents.emit('forcedUpdateBottomLeft', this.wakeData);
            }, 200);
            this.scene.wake(this.parentScene);
          },
          callbackScope: this,
        });
        return;
      }
      if (this.turn <= 1) {
        const duration = 1000;
        this.timeline = this.tweens.createTimeline();
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          duration: duration / 2,
        });
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: this.faune.body.x - 20,
          y: this.faune.body.y - 20,
          duration: duration / 8,
          onComplete: () => { this.faune.setTint(0xff0000); },
        });
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          duration: duration / 8,
          onStart: () => { this.faune.setTint(0xffffff); },
          onComplete: () => { this.faune.setTint(0xff0000); },
        });
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: this.faune.body.x - 20,
          y: this.faune.body.y + 20,
          duration: duration / 8,
          onStart: () => { this.faune.setTint(0xffffff); },
          onComplete: () => { this.faune.setTint(0xff0000); },
        });
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          duration: duration / 8,
          onStart: () => { this.faune.setTint(0xffffff); },
          onComplete: () => { this.faune.setTint(0xff0000); },
        });
        this.timeline.add({
          targets: this.enemy,
          ease: 'Power1',
          x: 100,
          y: 100,
          onComplete: () => { this.faune.setTint(0xffffff); },
          duration,
        });
        this.timeline.play();
        this.faune.handleDamage(0, 0, false);
        promptMessage(
          [`${this.enemyType} attacks Faune with 100 damage power`],
          2000,
          this,
        );
      }
      this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
    }
    this.index = this.index === 0 ? 1 : 0;
  }

  builder() {
    this.time.removeAllEvents();
    if (this.timeline) this.timeline.destroy();
    if (this.faune) this.faune.destroy();
    this.add.image(0, 0, 'battleBg').setOrigin(-0.0225, 0).setDepth(-100).setScale(0.2);
    this.scene.sendToBack(this);
    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    necromancerAnims(this.anims);
    ogreAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    const sceneScale = 1.75;
    this.faune = new Faune(this, 300, 110, 'faune');
    this.faune.setScale(sceneScale);
    this.faune.setCharacterScale(sceneScale);
    this.faune.setKnives(this.knives);
    if (this.dataProvided) {
      this.faune.setHealth(this.initHealth);
      this.faune.setScore(this.initScore);
    }
    switch (this.enemyType) {
      case 'Lizards':
        this.enemy = new Lizards(this, 100, 100, 'lizard').setScale(sceneScale);
        break;
      case 'Necromancers':
        this.enemy = new Necromancers(this, 100, 100, 'lizard').setScale(sceneScale);
        break;
      case 'Ogres':
        this.enemy = new Ogres(this, 100, 100, 'lizard').setScale(sceneScale);
        break;
      default:
        this.enemy = new Lizards(this, 100, 100, 'lizard');
        break;
    }

    this.physics.add.collider(
      this.knives,
      this.enemy,
      this.handleKnifeEnemyCollision,
      undefined,
      this,
    );

    this.enemy.destroyMovement();
    this.heroes = [this.faune];
    this.enemies = [this.enemy];
    this.units = [this.faune, this.lizard];
    this.index = 0;
  }

  create() {
    if (this.halt === undefined) {
      this.scene.launch('BattleUIScene');
      this.builder();
    }
  }
}