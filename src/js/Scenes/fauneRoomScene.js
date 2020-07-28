import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';


export default class FauneRoomScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.fauneRoom,
    });
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const sceneScale = 1.75;
    createFauneAnims(this.anims);
    createChestAnims(this.anims);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.cameras.main.setBackgroundColor('#000');
    this.map = this.make.tilemap({ key: 'fauneRoom_map' });
    this.tileset = this.map.addTilesetImage('Inner', 'room_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset);
    this.objectsMiddleLayer = this.map.createStaticLayer('ObjectsMiddle', this.tileset);
    this.objectsLayer = this.map.createStaticLayer('Objects', this.tileset);
    this.objectsTopLayer = this.map.createStaticLayer('ObjectsTop', this.tileset);
    this.chestsObjectsLayer = this.map.getObjectLayer('Chests');


    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    this.chestsObjectsLayer.objects.forEach(chestObject => {
      this.chests.get(chestObject.x + 32, chestObject.y + 64, 'treasure');
    });

    this.chests.getChildren().forEach(child => {
      child.setScale(2);
    });

    const layers = [
      this.floorLayer,
      this.objectsLayer,
      this.objectsMiddleLayer,
      this.objectsTopLayer,
    ];

    this.faune = new Faune(this, 100, 100, 'faune');
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
    if (this.faune.body.x < 240 && this.faune.body.x > 145 && this.faune.body.y > 280) {
      const dataToPass = {
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 148, y: 200 },
        looking: 'down',
      };
      console.log(dataToPass);
      this.scene.start(Handler.scenes.town, dataToPass);
    }
  }
}