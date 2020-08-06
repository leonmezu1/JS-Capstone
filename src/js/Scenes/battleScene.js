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

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.enemy.decreaseHealth(100);
      this.enemy.setTint(0xff0000);
      setTimeout(() => {
        this.enemy.setTint(0xffffff);
      }, 100);
      this.faune.setScore(50);
      console.log(this.enemy.health);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  nextTurn() {
    this.index += 1;
    // if there are no more units, we start again from the first one
    if (this.index >= this.units.length) {
      this.index = 0;
    }
    if (this.units[this.index]) {
      // if its player hero
      if (this.units[this.index] instanceof Faune) {
        this.events.emit('PlayerSelect', this.index);
      } else { // else if its enemy unit
        this.faune.handleDamage(0, 0, false);
        console.log(this.faune.getHealth());
        /* // pick random hero
        const r = Math.floor(Math.random() * this.heroes.length);
        // call the enemy's attack function
        this.units[this.index].attack(this.heroes[r]);
        // add timer for the next turn, so will have smooth gameplay */
        this.time.addEvent({ delay: 1000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  create() {
    this.scene.sendToBack(this);
    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    necromancerAnims(this.anims);
    ogreAnims(this.anims);
    const sceneScale = 1.75;
    this.scene.run('BattleUIScene');
    this.faune = new Faune(this, 300, 110, 'faune');
    this.faune.setScale(sceneScale);
    this.faune.setCharacterScale(sceneScale);
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
        this.enemy = new Lizards(this, 100, 100, 'lizard').setScale(sceneScale);
        break;
    }
    this.enemy.destroyMovement();
    this.heroes = [this.faune];
    this.enemies = [this.enemy];
    this.units = [this.faune, this.lizard];
    this.index = -1;
  }
}