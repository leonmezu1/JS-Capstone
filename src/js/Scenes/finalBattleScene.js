import Phaser from 'phaser';
import sceneEvents from '../events/events';
import createDragonAnims from '../gameObjects/anims/dragonAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createWizardAnims from '../gameObjects/anims/wizardAnims';
import Faune from '../gameObjects/characters/faune';
import Wizard from '../gameObjects/characters/wizard';
import Dragon from '../gameObjects/enemies/dragon';
import promtDiag from '../utils/diagHelper';
import { getSystemAudio } from '../utils/localStorage';
import promptMessage from '../utils/messagesHelper';
import { Handler } from './scenesHandler';

export default class finalBattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.finalBattle,
    });
    this.hit = 0;
    this.collisionTimer = true;
    this.collisionTimer2 = true;
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initCoins = data.dataToPass.coins;
      this.initHealth = data.dataToPass.health;
    } else {
      this.dataProvided = false;
    }
  }

  handleFauneDragon() {
    if (this.collisionTimer) {
      this.collisionTimer = false;
      const dx = this.faune.x - this.dragon.x;
      const dy = this.faune.y - this.dragon.y;
      this.faune.handleDamage(dx, dy, false, 100);
      this.hit += 1;
      setTimeout(() => {
        this.collisionTimer = true;
      }, 300);
    }
  }

  handleKnifeDragon(dragon, knife) {
    knife.destroy();
    this.dragon.decreaseHealth(100);
    this.faune.setScore(100);
    sceneEvents.emit('player-score-changed', this.faune.getScore());
  }

  handleFauneWizard() {
    if (this.collisionTimer2) {
      this.collisionTimer2 = false;
      if (this.dragon.body) {
        promtDiag(['HA! HA! HA!, you can\'t defeat me'], 2000, this);
      } else {
        promtDiag(['You win...', 'I\'ll return the king and leave the forest for ever'], 2500, this);
        const dataToPass = {
          score: this.faune.getScore(),
          coins: this.faune.getCoins(),
        };
        if (this.scene.isActive('BattleUIScene')) this.scene.stop('BattleUIScene');
        setTimeout(() => {
          if (this.scene.isActive(Handler.scenes.battle)) {
            this.scene.stop(Handler.scenes.battle);
          }
          this.scene.stop(Handler.scenes.ui);
          this.scene.start(Handler.scenes.victory, { dataToPass });
        }, 5000);
      }
      setTimeout(() => {
        this.collisionTimer2 = true;
      }, 2500);
    }
  }

  dragonAttack() {
    if (this.faune.body) {
      if (this.dragon.body) {
        this.dragon.destroyMovement();
        const duration = 1500;
        if (this.timeline) this.timeline.destroy();
        this.timeline = this.tweens.createTimeline();
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          onStart: () => {
            if (this.dragon.body.x < this.faune.body.x) {
              this.dragon.anims.play('dragon-right');
            } else {
              this.dragon.anims.play('dragon-left');
            }
          },
          duration: duration / 2,
        });
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: this.faune.body.x - 20,
          y: this.faune.body.y - 20,
          duration: duration / 8,
        });
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          duration: duration / 8,
        });
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: this.faune.body.x - 20,
          y: this.faune.body.y + 20,
          duration: duration / 8,
        });
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: this.faune.body.x,
          y: this.faune.body.y,
          duration: duration / 8,
        });
        this.timeline.add({
          targets: this.dragon,
          ease: 'Power1',
          x: 100,
          y: 100,
          onComplete: () => {
            this.turn = 0;
            this.index = 0;
          },
          duration,
        });
        this.timeline.play();
        promptMessage(
          [`${this.dragon.characterType} attacks Faune with 100 damage power`],
          2000,
          this,
        );
        setTimeout(() => {
          this.dragon.enableMovement();
        }, 2000);
      }
    }
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createFauneAnims(this.anims);
    createWizardAnims(this.anims);
    createDragonAnims(this.anims);
    this.scene.run(Handler.scenes.ui);
    this.cameras.main.shake(500);
    setTimeout(() => {
      promtDiag(['I cant \' believe you made it this far', 'But this is the further you\'ll get...'], 2000, this);
    }, 500);
    if (getSystemAudio().music === true) this.sound.stopAll();
    this.map = this.make.tilemap({ key: 'finalBattle_map' });
    const tileset = this.map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createDynamicLayer('Floor', tileset, 0, 0);
    this.wallLayers = this.map.createStaticLayer('Walls', tileset, 0, 0);
    this.wallLayers.setCollisionByProperty({ collides: true });
    const { width, height } = this.scale;
    this.evilWizard = new Wizard(this, width * 0.5, height * 0.2, 'wizard');

    if (this.dataProvided) {
      this.faune = new Faune(
        this,
        width * 0.5,
        height * 0.8,
        'faune',
      );
      this.faune.setScore(this.initScore);
      this.faune.setHealth(this.initHealth);
      this.faune.incrementCoins(this.initCoins);

      this.knives = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
      });

      this.faune.setKnives(this.knives);
    }
    setTimeout(() => {
      if (getSystemAudio().music === true) {
        this.roomMedley = this.sound.add('battle_music', {
          mute: false,
          volume: 0.175,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0,
        });
        this.roomMedley.play();
      }
      this.dragon = new Dragon(this, width * 0.5, height * 0.5, 'dragon').setScale(0.5);
      this.dragon.anims.play('dragon-down');
      this.physics.add.collider(this.faune, this.wallLayers);
      this.physics.add.collider(this.dragon, this.wallLayers);
      setInterval(() => {
        this.dragonAttack();
      }, 5000);

      this.fauneWizard = this.physics.add.collider(
        this.faune,
        this.evilWizard,
        this.handleFauneWizard,
        undefined,
        this,
      );
      this.fauneDragon = this.physics.add.collider(
        this.faune,
        this.dragon,
        this.handleFauneDragon,
        undefined,
        this,
      );
      this.knivesDragon = this.physics.add.collider(
        this.knives,
        this.dragon,
        this.handleKnifeDragon,
        undefined,
        this,
      );
    }, 6000);
    this.scene.sendToBack(this);
    this.scene.bringToTop(Handler.scenes.ui);
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
    if (this.dragon && this.dragon.body) {
      if (this.dragon.body.velocity.x > 0) this.dragon.anims.play('dragon-right');
      if (this.dragon.body.velocity.x < 0) this.dragon.anims.play('dragon-left');
      if (this.dragon.body.velocity.x === 0 && this.dragon.body.velocity.y > 0) this.dragon.anims.play('dragon-down');
      if (this.dragon.body.velocity.x === 0 && this.dragon.body.velocity.y < 0) this.dragon.anims.play('dragon-up');
    }
  }
}