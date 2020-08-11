import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import Brother from '../gameObjects/characters/brother';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';
import createElfAnims from '../gameObjects/anims/elfAnims';
import promtDiag from '../utils/diagHelper';
import { getSystemAudio } from '../utils/localStorage';

export default class FauneRoomScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.fauneRoom,
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
      if (data.dataToPass.gameLog) this.gameLog = data.dataToPass.gameLog;
    } else {
      this.dataProvided = false;
    }
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
  }

  handlePlayerBrotherCollision() {
    this.cameras.main.setBounds(0, 0, 790, 790);
    const timer = 2500;
    promtDiag(Handler.dialogues.first, timer, this);
    if (!this.dataProvided) {
      setTimeout(() => {
        this.scene.run(Handler.scenes.town);
        this.scene.bringToTop(Handler.scenes.town);
        this.scene.setVisible(false);
      }, 10000);

      setTimeout(() => {
        this.scene.stop(Handler.scenes.town);
        this.scene.setVisible(true);
      }, 18000);
    }
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
    this.cameras.main.fadeIn(3000, 0, 0, 0);
    const sceneScale = 1.75;
    createFauneAnims(this.anims);
    createChestAnims(this.anims);
    createElfAnims(this.anims);

    this.map = this.make.tilemap({ key: 'fauneRoom_map' });
    this.tileset = this.map.addTilesetImage('Inner', 'room_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset);
    this.objectsMiddleLayer = this.map.createStaticLayer('ObjectsMiddle', this.tileset);
    this.objectsLayer = this.map.createStaticLayer('Objects', this.tileset);
    this.objectsTopLayer = this.map.createStaticLayer('ObjectsTop', this.tileset);

    const layers = [
      this.floorLayer,
      this.objectsLayer,
      this.objectsMiddleLayer,
      this.objectsTopLayer,
    ];

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    if (!this.dataProvided) {
      this.faune = new Faune(this, 150, 150, 'faune');
      this.faune.setScale(sceneScale);
      this.faune.setCharacterScale(sceneScale);
      this.faune.setKnives(this.knives);
    } else {
      this.faune = new Faune(this, this.initPosition.x, this.initPosition.y, 'faune');
      this.faune.setScore(this.initScore);
      this.faune.setHealth(this.initHealth);
      this.faune.incrementCoins(this.initCoins);
      if (this.initLooking) {
        this.faune.anims.play(`faune-idle-${this.initLooking}`);
      }
      this.faune.setScale(sceneScale);
      this.faune.setCharacterScale(sceneScale);
      this.faune.setKnives(this.knives);
      this.faune.setDepth(100);
    }

    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    this.chests.get(116, 26, 'treasure').setID('chest1');
    this.chests.get(238, 11, 'treasure').setID('chest2');

    this.chests.getChildren().forEach(chest => {
      chest.setScale(sceneScale);
      if (this.dataProvided) {
        if (this.chestLog[chest.getID()] === 'opened') chest.opened();
      }
    });

    this.brother = new Brother(this, 260, 200, 'elf').setScale(sceneScale);

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

    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.faune,
      this.brother,
      this.handlePlayerBrotherCollision,
      undefined,
      this,
    );

    if (this.chestLog) this.faune.setChestLog(this.chestLog);
    this.faune.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 370, 300);
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }

    if (this.faune.body.x < 240 && this.faune.body.x > 145 && this.faune.body.y > 280) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 150, y: 200 },
        gameLog: this.faune.getGameLog(),
        looking: 'down',
      };
      this.roomMedley.stop();
      this.scene.start(Handler.scenes.town, { dataToPass });
    }
  }
}