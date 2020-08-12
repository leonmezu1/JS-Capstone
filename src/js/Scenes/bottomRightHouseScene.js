import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';
import Lizards from '../gameObjects/enemies/lizards';
import sceneEvents from '../events/events';
import promtDiag from '../utils/diagHelper';
import Wizard from '../gameObjects/characters/wizard';
import turnBasedFight from '../utils/turnFightHelper';
import { getSystemAudio } from '../utils/localStorage';

export default class BottomRightHouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.bottomRightHouse,
    });
    this.collisionTimer = true;
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
    } else {
      this.dataProvided = false;
    }
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
  }

  handleKnifeEnemyCollision(knife, enemy) {
    knife.destroy();
    enemy.decreaseHealth(100);
    enemy.setTint(0xff0000);
    setTimeout(() => {
      enemy.setTint(0xffffff);
    }, 100);
    this.faune.setScore(50);
  }

  handlePlayerWizardCollision() {
    if (this.collisionTimer) {
      this.collisionTimer = false;
      setTimeout(() => {
        this.collisionTimer = true;
      }, 5000);
      if (this.lizards.getLength() === 0) {
        promtDiag(Handler.dialogues.third, 2000, this);
        this.faune.setGameLog({ bottomRightHouseclear: true });
      } else {
        promtDiag(Handler.dialogues.helpMe, 2000, this);
      }
    }
  }

  handlePlayerEnemyCollision(faune, enemy) {
    if (getSystemAudio().music) this.roomMedley.stop();
    turnBasedFight(this.faune, enemy, this);
  }

  forcedWake(data) {
    this.faune.setHealth(data.health);
    this.faune.setScoreNonIcremental(data.score);
  }

  wake() {
    if (getSystemAudio().music) this.roomMedley.play();
    this.cameras.main.shake(300, 0.03);
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    if (getSystemAudio().music === true) {
      this.roomMedley = this.sound.add('title_music', {
        mute: false,
        volume: 0.025,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      });
      this.roomMedley.play();
    }
    sceneEvents.on('forcedUpdateBottomLeft', this.forcedWake, this);
    this.sys.events.on('wake', this.wake, this);
    this.scene.run(Handler.scenes.ui);
    const sceneScale = 1.75;
    createFauneAnims(this.anims);
    createChestAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.cameras.main.setBackgroundColor('#000');
    this.map = this.make.tilemap({ key: 'bottomRightHouse_map' });
    this.tileset = this.map.addTilesetImage('Inner', 'room_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset);
    this.objectsMiddleLayer = this.map.createStaticLayer('ObjectsBottom', this.tileset);
    this.objectsLayer = this.map.createStaticLayer('Objects', this.tileset);
    this.objectsTopLayer = this.map.createStaticLayer('ObjectsTop', this.tileset);

    const layers = [
      this.floorLayer,
      this.objectsLayer,
      this.objectsMiddleLayer,
      this.objectsTopLayer,
    ];

    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    this.chests.get(300, 280, 'treasure').setID('chest3');
    this.chests.get(250, 282, 'treasure').setID('chest4');
    this.chests.get(200, 282, 'treasure').setID('chest5');
    this.chests.get(150, 282, 'treasure').setID('chest6');

    this.chests.getChildren().forEach(chest => {
      chest.setScale(sceneScale);
      if (this.dataProvided) {
        if (this.chestLog[chest.getID()] === 'opened') chest.opened();
      }
    });

    this.faune = new Faune(this, this.initPosition.x, this.initPosition.y, 'faune');

    this.faune.setScore(
      this.initScore = this.initScore || 0,
    );
    this.faune.setHealth(
      this.initHealth = this.initHealth || 0,
    );
    this.faune.incrementCoins(
      this.initCoins = this.initCoins || 0,
    );

    if (this.initLooking) {
      this.faune.anims.play(`faune-idle-${this.initLooking}`);
    }

    if (this.gameLog) this.faune.setGameLog(this.gameLog);


    this.faune.setScale(sceneScale);
    this.faune.setCharacterScale(sceneScale);
    this.faune.setKnives(this.knives);


    layers.forEach(layer => {
      layer.setScale(2, 2);
      layer.setOrigin(1, 0.5);
      layer.setCollisionByProperty({ collides: true });
      this.physics.add.collider(
        this.faune,
        layer,
      );

      this.physics.add.collider(
        this.knives,
        layer, (knives) => { knives.destroy(); },
        undefined,
        this,
      );
    });

    this.lizards = this.physics.add.group({
      classType: Lizards,
      createCallback: (go) => {
        const lizGo = go;
        lizGo.body.onCollide = true;
      },
    });

    if (this.gameLog === undefined || !this.gameLog.bottomRightHouseclear) {
      layers.forEach(layer => {
        this.physics.add.collider(
          this.lizards,
          layer,
        );
      });

      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');
      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');
      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');
      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');
      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');
      this.lizards.get(Phaser.Math.Between(50, 150), Phaser.Math.Between(50, 150), 'lizard');

      this.lizards.getChildren().forEach(lizard => {
        lizard.setScale(sceneScale);
        lizard.setCollideWorldBounds(true);
      });

      promtDiag(Handler.dialogues.helpMe, 2000, this);
    }

    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );

    this.wizard = new Wizard(this, 300, 250, 'wizard').setScale(sceneScale);

    this.physics.add.collider(
      this.faune,
      this.wizard,
      this.handlePlayerWizardCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );

    this.physics.world.setBounds(0, 0, 370, 300);
    this.faune.setCollideWorldBounds(true);
    this.faune.setChestLog(this.chestLog);
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
    if (this.faune.body.x < 240 && this.faune.body.x > 160 && this.faune.body.y < 5) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 291, y: 400 },
        gameLog: this.faune.getGameLog(),
        looking: 'up',
      };
      if (getSystemAudio().music) this.roomMedley.stop();
      this.scene.start(Handler.scenes.town, { dataToPass });
    }
  }
}
