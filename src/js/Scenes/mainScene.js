import Phaser from 'phaser';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
import { Handler } from './scenesHandler';
import sceneEvents from '../events/events';
import debugDraw from '../utils/collisionDebugger';
import createChestAnims from '../gameObjects/anims/chestAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createLavaFountainAnims from '../gameObjects/anims/lavaFountainAnims';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createPikeAnims from '../gameObjects/anims/pikesAnims';
import createNecromancerAnims from '../gameObjects/anims/necromancerAnims';
import createOgreAnims from '../gameObjects/anims/ogreAnims';
import Chest from '../gameObjects/items/chests';
import Faune from '../gameObjects/characters/faune';
import LavaFountains from '../gameObjects/items/lavaFountains';
import Lizards from '../gameObjects/enemies/lizards';
import Pikes from '../gameObjects/items/pikes';
import Necromancers from '../gameObjects/enemies/necromancers';
import Ogres from '../gameObjects/enemies/ogres';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
    this.hit = 0;
  }

  handlePlayerLizardCollision(faune, lizard) {
    const dx = faune.x - lizard.x;
    const dy = faune.y - lizard.y;
    this.hit = 1;
    this.faune.handleDamage(dx, dy);

    sceneEvents.emit('player-damaged', this.faune.getHealth());
    if (this.faune.getHealth() <= 0) {
      if (this.fauneLizardCollision) {
        this.fauneLizardCollision.world.destroy();
      }
    }
  }

  handleFaunePikeCollide() {
    this.faune.handleStaticDamage();
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
    createLavaFountainAnims(this.anims);
    createPikeAnims(this.anims);
    createNecromancerAnims(this.anims);
    createOgreAnims(this.anims);

    this.map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = this.map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);

    this.floorLayer = this.map.createDynamicLayer('Floor', tileset, 0, 0);
    this.wallLayers = this.map.createStaticLayer('Walls', tileset, 0, 0);
    this.pikesObjectsLayer = this.map.getObjectLayer('Pikes');
    this.lavaFountainsObjectsLayer = this.map.getObjectLayer('LavaFountains');
    this.chestsObjectsLayer = this.map.getObjectLayer('Chests');
    this.LizardsLayer = this.map.getObjectLayer('Lizards');
    this.wallLayers.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, 2000, 2000);


    debugDraw(this.wallLayers, this);

    this.sys.animatedTiles.init(this.map);

    this.pikes = this.physics.add.staticGroup({
      classType: Pikes,
    });

    this.lavaFountains = this.physics.add.staticGroup({
      classType: LavaFountains,
    });

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

    this.necromancers = this.physics.add.group({
      classType: Necromancers,
      createCallback: (go) => {
        const necGo = go;
        necGo.body.onCollide = true;
      },
    });

    this.ogres = this.physics.add.group({
      classType: Ogres,
      createCallback: (go) => {
        const ogGo = go;
        ogGo.body.onCollide = true;
      },
    });

    this.pikesObjectsLayer.objects.forEach(pikeTile => {
      this.pikes.get(pikeTile.x + 8, pikeTile.y - 8, 'pikes');
    });

    this.lavaFountainsObjectsLayer.objects.forEach(fountain => {
      this.lavaFountains.get(fountain.x + 8, fountain.y - 8, 'lava');
    });

    this.chestsObjectsLayer.objects.forEach(chestObject => {
      this.chests.get(chestObject.x + 8, chestObject.y - 8, 'treasure');
    });

    this.LizardsLayer.objects.forEach(lizardFromLayer => {
      this.lizards.get(lizardFromLayer.x + 8, lizardFromLayer.y - 8, 'lizard');
    });

    this.ogres.get(660, 240, 'ogre');
    this.necromancers.get(660, 200, 'necromancer');


    this.faune = new Faune(this, 660, 240, 'faune');
    this.faune.setKnives(this.knives);


    this.physics.add.collider(this.lizards, this.wallLayers);
    this.physics.add.collider(this.lizards, this.lavaFountains);
    this.physics.add.collider(this.lizards, this.pikes);
    this.physics.add.collider(this.lizards, this.chests);
    this.physics.add.collider(this.ogres, this.wallLayers);
    this.physics.add.collider(this.ogres, this.lavaFountains);
    this.physics.add.collider(this.ogres, this.pikes);
    this.physics.add.collider(this.ogres, this.chests);
    this.physics.add.collider(this.necromancers, this.wallLayers);
    this.physics.add.collider(this.necromancers, this.lavaFountains);
    this.physics.add.collider(this.necromancers, this.pikes);
    this.physics.add.collider(this.necromancers, this.chests);
    this.physics.add.collider(this.faune, this.lavaFountains);
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
      this.handleKnifeEnemyCollision,
      undefined,
      this);

    this.physics.add.collider(this.knives,
      this.ogres,
      this.handleKnifeEnemyCollision,
      undefined,
      this);

    this.physics.add.collider(this.knives,
      this.necromancers,
      this.handleKnifeEnemyCollision,
      undefined,
      this);

    this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.faune,
      this.pikes,
      this.handleFaunePikeCollide,
      undefined,
      this,
    );

    this.cameras.main.startFollow(this.faune, true);
    this.scene.sendToBack(this);
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