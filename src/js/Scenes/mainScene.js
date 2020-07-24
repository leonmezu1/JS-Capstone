import Phaser from 'phaser';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
import { Handler } from './scenesHandler';
import sceneEvents from '../events/events';
import Lizards from '../gameObjects/enemies/lizards';
import debugDraw from '../utils/collisionDebugger';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
    this.hit = 0;
  }

  handlePlayerLizardCollision(obj1, obj2) {
    const lizard = obj2;
    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;
    this.hit = 1;
    this.faune.handleDamage(dx, dy);

    sceneEvents.emit('player-damaged', this.faune.getHealth());
    if (this.faune.getHealth() <= 0) {
      if (this.fauneLizardCollision) {
        this.fauneLizardCollision.world.destroy();
      }
    }
  }

  handleKnifeLizzardCollision(knife, lizzard) {
    knife.destroy();
    lizzard.destroy();
    this.faune.setScore(100);
    sceneEvents.emit('player-score-changed', this.faune.getScore());
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  create() {
    this.scene.run(Handler.scenes.ui);

    createFauneAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnims(this.anims);

    this.map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = this.map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);

    this.floorLayer = this.map.createDynamicLayer('Floor', tileset, 0, 0);
    this.wallLayers = this.map.createStaticLayer('Walls', tileset, 0, 0);
    this.pikesObjectsObjectsLayer = this.map.getObjectLayer('LavaFountains');
    this.lavaFountainsObjectsLayer = this.map.getObjectLayer('Pikes');
    this.chestsObjectsLayer = this.map.getObjectLayer('Chests');
    this.wallLayers.setCollisionByProperty({ collides: true });

    debugDraw(this.wallLayers, this);

    this.sys.animatedTiles.init(this.map);

    this.lavaFountains = this.physics.add.staticGroup();

    this.pikes = this.physics.add.staticGroup();

    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });
    this.lizards = this.physics.add.group({
      classType: Lizards,
      createCallback: (go) => {
        const lizGo = go;
        lizGo.body.onCollide = true;
      },
    });

    this.chestsObjectsLayer.objects.forEach(chestObject => {
      this.chests.get(chestObject.x + 8, chestObject.y - 8, 'treasure');
    });

    this.faune = new Faune(this, 660, 240, 'faune');
    this.faune.setKnives(this.knives);


    this.physics.add.collider(this.lizards, this.wallLayers);
    this.fauneLizardCollision = this.physics.add.collider(this.faune, this.wallLayers);
    this.physics.add.collider(
      this.faune,
      this.chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.knives,
      this.wallLayers, (knives) => { knives.destroy(); },
      undefined,
      this,
    );

    this.physics.add.collider(this.knives,
      this.lizards,
      this.handleKnifeLizzardCollision,
      undefined,
      this);

    this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this,
    );

    this.cameras.main.startFollow(this.faune, true);
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    if (this.hit > 0) {
      this.hit += 1;
      if (this.hit > 7) this.hit = 0;
      return;
    }

    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}