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

    this.faune = new Faune(this, 100, 100, 'faune');
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
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }

    console.log(this.faune.body.x, this.faune.body.y);
  }
}