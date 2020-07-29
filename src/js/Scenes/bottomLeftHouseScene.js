import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';

export default class BottomLeftHouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.bottomLeftHouse,
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
    } else {
      this.dataProvided = false;
    }
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run(Handler.scenes.ui);
    const sceneScale = 1.75;
    createFauneAnims(this.anims);
    createChestAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.cameras.main.setBackgroundColor('#000');
    this.map = this.make.tilemap({ key: 'bottomLeftHouse_map' });
    this.tileset = this.map.addTilesetImage('Inner', 'room_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset);
    this.objectsLayer = this.map.createStaticLayer('Objects', this.tileset);
    this.objectsTopLayer = this.map.createStaticLayer('ObjectsTop', this.tileset);

    const layers = [
      this.floorLayer,
      this.objectsLayer,
      this.objectsTopLayer,
    ];

    this.chests = this.physics.add.staticGroup({
      classType: Chest,
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
      debugDraw(layer, this);
    });

    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );

    this.physics.world.setBounds(0, 0, 370, 300);
    this.faune.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }

    console.log(this.faune.body.x, this.faune.body.y);
    if (this.faune.body.x < 240 && this.faune.body.x > 160 && this.faune.body.y < 5) {
      const dataToPass = {
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 150, y: 395 },
        looking: 'up',
      };
      this.scene.start(Handler.scenes.town, { dataToPass });
    }
  }
}
