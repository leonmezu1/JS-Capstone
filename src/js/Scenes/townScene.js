import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';
import Faune from '../gameObjects/characters/faune';

export default class TownScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.town,
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
    } else {
      this.dataProvided = false;
    }
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.map = this.make.tilemap({ key: 'town_map' });
    this.tileset = this.map.addTilesetImage('Overworld', 'town_tile', 16, 16, 1, 2);
    this.grassLayer = this.map.createStaticLayer('Grass', this.tileset);
    this.castleExtraLayer = this.map.createStaticLayer('CastleExtra', this.tileset);
    this.bushesLayer = this.map.createStaticLayer('Bushes', this.tileset);
    this.housesLayer = this.map.createStaticLayer('Houses', this.tileset);
    this.caveLayer = this.map.createStaticLayer('Cave', this.tileset);
    this.castleMiddleLayer = this.map.createStaticLayer('CastleMiddle', this.tileset);
    this.castleFrontLayer = this.map.createStaticLayer('CastleFront', this.tileset);
    this.castleRoofLayer = this.map.createStaticLayer('CastleRoof', this.tileset);
    this.caveEntranceLayer = this.map.createStaticLayer('CaveEntrance', this.tileset);

    const layers = [
      this.grassLayer,
      this.castleExtraLayer,
      this.bushesLayer,
      this.housesLayer,
      this.caveLayer,
      this.castleFrontLayer,
      this.castleMiddleLayer,
      this.castleRoofLayer,
      this.caveEntranceLayer,
    ];

    this.faune = new Faune(
      this,
      this.initPosition.x = this.initPosition.x || 100,
      this.initPosition.y = this.initPosition.y || 120,
      'faune',
    );
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
    this.faune.setKnives(this.knives);

    layers.forEach(layer => {
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

      debugDraw(layer, this);
    });

    this.physics.world.setBounds(0, 0, 790, 790);
    this.faune.setCollideWorldBounds(true);
    this.knives.world.setBoundsCollision(true);
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
    this.faune.setChestLog(this.chestLog);
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
    if (
      this.faune.body.x < 151
        && this.faune.body.x > 144
        && this.faune.body.y < 195
        && this.faune.body.y > 160
    ) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 210, y: 270 },
        looking: 'up',
      };
      this.scene.start(Handler.scenes.fauneRoom, { dataToPass });
    } else if (
      this.faune.body.x < 295
      && this.faune.body.x > 288
      && this.faune.body.y > 402
    ) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 200, y: 20 },
        looking: 'down',
      };
      this.scene.start(Handler.scenes.bottomRightHouse, { dataToPass });
    } else if (
      this.faune.body.x < 151
      && this.faune.body.x > 144
      && this.faune.body.y > 403
      && this.faune.body.y < 415
    ) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 207, y: 20 },
        looking: 'down',
      };
      this.scene.start(Handler.scenes.bottomLeftHouse, { dataToPass });
    } else if (
      this.faune.body.x < 295
      && this.faune.body.x > 288
      && this.faune.body.y < 201
      && this.faune.body.y > 160
    ) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 166, y: 266 },
        looking: 'up',
      };
      this.scene.start(Handler.scenes.topRightHouse, { dataToPass });
    }
    console.log(this.faune.body.x, this.faune.body.y);
  }
}