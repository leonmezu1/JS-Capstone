import Phaser from 'phaser';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
import { Handler } from './scenesHandler';
import sceneEvents from '../events/events';
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
import Crank from '../gameObjects/items/cranks';
import Door from '../gameObjects/items/doors';
import turnBasedFight from '../utils/turnFightHelper';
import { getSystemAudio } from '../utils/localStorage';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
    this.hit = 0;
    this.portalTimer = true;
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

  handlePlayerCrankCollision(faune, crank) {
    crank.activate();
    if (crank.getName() === 's1') {
      this.doors.getChildren().forEach(door => {
        if (door.getName() === 'Second') {
          door.open();
          this.physics.world.removeCollider(this.s1Collider);
        }
      });
    } else if (crank.getName() === 's2') {
      this.doors.getChildren().forEach(door => {
        if (door.getName() === 'Last') {
          door.open();
          this.physics.world.removeCollider(this.s2Collider);
        }
      });
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
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  create() {
    if (getSystemAudio().music === true) this.sound.stopAll();
    if (getSystemAudio().music === true) {
      this.roomMedley = this.sound.add('warzone_music', {
        mute: false,
        volume: 0.125,
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
    this.switchObjectsLayer = this.map.getObjectLayer('Switch');
    this.doorsObjectsLayer = this.map.getObjectLayer('Doors');
    this.LizardsLayer = this.map.getObjectLayer('Lizards');
    this.portalLayer = this.map.getObjectLayer('Portal');
    this.wallLayers.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, 2000, 2000);

    this.sys.animatedTiles.init(this.map);

    this.cranks = this.physics.add.staticGroup({
      classType: Crank,
      createCallback: (go) => {
        const crankGo = go;
        crankGo.body.onCollide = true;
      },
    });

    this.doors = this.physics.add.staticGroup({
      classType: Door,
    });

    this.pikes = this.physics.add.staticGroup({
      classType: Pikes,
    });

    this.portals = this.physics.add.staticGroup({
      classType: Phaser.Physics.Arcade.Image,
      createCallback: (go) => {
        const ogGo = go;
        ogGo.body.onCollide = true;
      },
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

    this.switchObjectsLayer.objects.forEach(tile => {
      this.cranks.get(tile.x + 8, tile.y - 8, 'switchRight').setName(tile.name);
    });

    this.doorsObjectsLayer.objects.forEach(tile => {
      this.doors.get(tile.x + 16, tile.y - 16, 'doorClosed').setName(tile.name);
    });

    this.pikesObjectsLayer.objects.forEach(pikeTile => {
      this.pikes.get(pikeTile.x + 8, pikeTile.y - 8, 'pikes');
    });

    this.portalLayer.objects.forEach(portalTile => {
      this.portals.get(portalTile.x + 8, portalTile.y - 8, 'portal');
    });

    this.lavaFountainsObjectsLayer.objects.forEach(fountain => {
      this.lavaFountains.get(fountain.x + 8, fountain.y - 8, 'lava');
      this.ogres.get(fountain.x - 16, fountain.y + 16, 'ogre');
      this.necromancers.get(fountain.x + 16, fountain.y + 16, 'necromancer');
    });

    this.chestsObjectsLayer.objects.forEach(chestObject => {
      this.chests.get(chestObject.x + 8, chestObject.y - 8, 'treasure');
    });

    this.LizardsLayer.objects.forEach(lizardFromLayer => {
      this.lizards.get(lizardFromLayer.x + 8, lizardFromLayer.y - 8, 'lizard');
    });

    this.faune = new Faune(
      this,
      this.initPosition.x = this.initPosition.x || 660,
      this.initPosition.y = this.initPosition.y || 240,
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

    if (this.gameLog) this.faune.setGameLog(this.gameLog);

    if (this.initLooking) {
      this.faune.anims.play(`faune-idle-${this.initLooking}`);
    }
    this.faune.setKnives(this.knives);


    this.physics.add.collider(this.lizards, this.wallLayers);
    this.physics.add.collider(this.lizards, this.lavaFountains);
    this.physics.add.collider(this.lizards, this.pikes);
    this.physics.add.collider(this.lizards, this.chests);
    this.physics.add.collider(this.lizards, this.doors);
    this.physics.add.collider(this.lizards, this.cranks);
    this.physics.add.collider(this.ogres, this.wallLayers);
    this.physics.add.collider(this.ogres, this.lavaFountains);
    this.physics.add.collider(this.ogres, this.pikes);
    this.physics.add.collider(this.ogres, this.chests);
    this.physics.add.collider(this.ogres, this.doors);
    this.physics.add.collider(this.necromancers, this.wallLayers);
    this.physics.add.collider(this.necromancers, this.lavaFountains);
    this.physics.add.collider(this.necromancers, this.pikes);
    this.physics.add.collider(this.necromancers, this.chests);
    this.physics.add.collider(this.necromancers, this.doors);
    this.physics.add.collider(this.faune, this.lavaFountains);
    this.physics.add.collider(this.faune, this.wallLayers);
    this.s1Collider = this.physics.add.collider(
      this.faune,
      this.doors.getChildren().filter(door => door.getName() === 'Second'),
    );
    this.s2Collider = this.physics.add.collider(
      this.faune,
      this.doors.getChildren().filter(door => door.getName() === 'Last'),
    );
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

    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.knives,
      this.ogres,
      this.handleKnifeEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(this.knives,
      this.necromancers,
      this.handleKnifeEnemyCollision,
      undefined,
      this);

    this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.ogres,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.necromancers,
      this.faune,
      this.handlePlayerEnemyCollision,
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

    this.physics.add.collider(
      this.faune,
      this.cranks,
      this.handlePlayerCrankCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.faune,
      this.portals,
      () => {
        if (this.portalTimer) {
          this.portalTimer = false;
          this.cameras.main.shake(500);
          const dataToPass = {
            score: this.faune.getScore(),
            coins: this.faune.getCoins(),
            health: this.faune.getHealth(),
          };
          setTimeout(() => {
            this.scene.start(Handler.scenes.finalBattle, { dataToPass });
          }, 500);
        }
      },
      undefined,
      this,
    );

    this.cameras.main.startFollow(this.faune, true);
    this.scene.sendToBack(this);
  }

  update() {
    if (this.hit > 0) {
      this.hit += 1;
      if (this.hit > 7) this.scene.hit = 0;
      return;
    }
    if (this.faune) {
      this.faune.update(this.cursors);
    }

    if (this.faune.body.y > 1573) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 765, y: 74 },
        gameLog: this.faune.getGameLog(),
        looking: 'down',
      };
      if (getSystemAudio().music) this.roomMedley.stop();
      this.scene.start(Handler.scenes.town, { dataToPass });
    }
  }
}