/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import Faune from '../gameObjects/characters/faune';
import Lizards from '../gameObjects/enemies/lizards';
import Necromancers from '../gameObjects/enemies/necromancers';
import Ogres from '../gameObjects/enemies/ogres';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import necromancerAnims from '../gameObjects/anims/necromancerAnims';
import ogreAnims from '../gameObjects/anims/ogreAnims';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BattleScene',
    });
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initCoins = data.dataToPass.coins;
      this.initHealth = data.dataToPass.health;
      this.initPosition = data.dataToPass.position;
      this.initLooking = data.dataToPass.looking;
      this.chestLog = data.dataToPass.chestLog;
      this.gameLog = data.dataToPass.gameLog;
      this.enemyType = data.dataToPass.enemyType;
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
        onComplete: () => { this.faune.anims.play('faune-idle-down'); },
        duration,
      });
      this.timeline.play();
      this.events.emit('Message', `Faune attacks ${this.enemyType} with 75 damage power`);
      this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
    }
  }

  nextTurn() {
    if (this.units[this.index] instanceof Faune) {
      this.events.emit('PlayerSelect', this.index);
    } else {
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
      this.events.emit('Message', `${this.enemyType} attacks Faune with 100 damage power`);
      this.time.addEvent({ delay: 2500, callback: this.nextTurn, callbackScope: this });
    }
    this.index = this.index === 0 ? 1 : 0;
  }

  create() {
    this.add.image(0, 0, 'battleBg').setOrigin(0).setDepth(-100).setScale(0.2);
    this.scene.sendToBack(this);
    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    necromancerAnims(this.anims);
    ogreAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    const sceneScale = 1.75;
    this.scene.run('BattleUIScene');
    this.faune = new Faune(this, 300, 110, 'faune');
    this.faune.setScale(sceneScale);
    this.faune.setCharacterScale(sceneScale);
    this.faune.setKnives(this.knives);
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
        this.enemy = new Ogres(this, 100, 100, 'ogre').setScale(sceneScale);
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
}