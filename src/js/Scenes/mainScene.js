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

  handleKnifeLizzardCollision(obj1, obj2) {
    obj1.destroy();
    obj2.destroy();
    this.faune.setScore(100);
    sceneEvents.emit('player-score-changed', this.faune.getScore());
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
    this.chestsObjectsLayer = this.map.getObjectLayer('Chests');


    this.sys.animatedTiles.init(this.map);

    this.chests = this.physics.add.staticGroup();
    this.chestsObjectsLayer.objects.forEach(chestObject => {
      this.chests.get(chestObject.x + 8, chestObject.y - 8, 'treasure');
    });
    this.wallLayers.setCollisionByProperty({ collides: true });

    this.faune = new Faune(this, 660, 240, 'faune');
    const lizards = this.physics.add.group({
      classType: Lizards,
      createCallback: (go) => {
        const lizGo = go;
        lizGo.body.onCollide = true;
      },
    });
    lizards.get(660, 280, 'lizard');
    lizards.get(660, 300, 'lizard');
    lizards.get(690, 280, 'lizard');
    lizards.get(670, 280, 'lizard');
    lizards.get(620, 280, 'lizard');

    const knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.add.sprite(616, 260, 'treasure');

    this.faune.setKnives(knives);

    this.fauneLizardCollision = this.physics.add.collider(this.faune, this.wallLayers);
    this.physics.add.collider(lizards, this.wallLayers);
    this.physics.add.collider(this.faune, this.chests);
    this.physics.add.collider(
      knives,
      this.wallLayers, (knives) => { knives.destroy(); },
      undefined,
      this,
    );

    this.physics.add.collider(knives,
      lizards,
      this.handleKnifeLizzardCollision,
      undefined,
      this);

    this.physics.add.collider(
      lizards,
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