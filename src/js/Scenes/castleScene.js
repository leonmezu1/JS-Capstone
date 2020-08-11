import Phaser from 'phaser';
import createChestAnims from '../gameObjects/anims/chestAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import { Handler } from './scenesHandler';
import promtDiag from '../utils/diagHelper';
import createKnightAnims from '../gameObjects/anims/knightAnims';
import Knight from '../gameObjects/characters/knight';
import { getSystemAudio } from '../utils/localStorage';


export default class CastleScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.castle,
    });
  }

  handlePlayerChestCollision(faune, chest) {
    this.faune.setChest(chest);
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

  handlePlayerKnightCollision() {
    promtDiag(Handler.dialogues.knight, 2800, this);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    if (getSystemAudio().music === true) {
      this.roomMedley = this.sound.add('horror_music', {
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
    const sceneScale = 1.75;
    createFauneAnims(this.anims);
    createChestAnims(this.anims);
    createKnightAnims(this.anims);

    this.map = this.make.tilemap({ key: 'castle_map' });
    this.tileset1 = this.map.addTilesetImage('castle_2', 'castle_tile', 16, 16, 1, 2);
    this.tileset2 = this.map.addTilesetImage('stairs_1', 'stairs_tile', 16, 16, 1, 2);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset1);
    this.ornamentsLayer = this.map.createStaticLayer('Ornaments', this.tileset1);
    this.stairsLayer = this.map.createStaticLayer('Stairs', this.tileset2);
    this.platformLayer = this.map.createStaticLayer('Platform', this.tileset1);
    this.columnsLayer = this.map.createStaticLayer('Columns', this.tileset1);
    this.wallsLayer = this.map.createStaticLayer('Walls', this.tileset1);
    this.wallsAdditionsLayer = this.map.createStaticLayer('WallsAdditions', this.tileset1);
    this.chairsLayer = this.map.createStaticLayer('Chairs', this.tileset1);

    const layers = [
      this.floorLayer,
      this.ornamentsLayer,
      this.stairsLayer,
      this.platformLayer,
      this.columnsLayer,
      this.wallsLayer,
      this.wallsAdditionsLayer,
      this.chairsLayer,
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
      if (this.gameLog) this.faune.setGameLog(this.gameLog);
      if (this.initLooking) {
        this.faune.anims.play(`faune-idle-${this.initLooking}`);
      }
      this.faune.setScale(sceneScale * 1.2);
      this.faune.setCharacterScale(sceneScale);
      this.faune.setKnives(this.knives);
      this.faune.setDepth(100);
    }

    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    this.chests.get(116, 350, 'treasure').setID('chest11');
    this.chests.get(238, 390, 'treasure').setID('chest13');
    this.chests.get(238, 430, 'treasure').setID('chest14');
    this.chests.get(238, 470, 'treasure').setID('chest12');

    this.chests.getChildren().forEach(chest => {
      chest.setScale(sceneScale);
      if (this.dataProvided) {
        if (this.chestLog[chest.getID()] === 'opened') chest.opened();
      }
    });

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

    this.knights = this.physics.add.group({
      classType: Knight,
    });

    this.knight = new Knight(this, 300, 400, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(424, 560, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(424, 624, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(424, 688, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(208, 560, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(208, 624, 'knight').setScale(sceneScale * 1.3);
    this.knights.get(208, 688, 'knight').setScale(sceneScale * 1.3);

    this.physics.add.collider(
      this.faune,
      this.knight,
      this.handlePlayerKnightCollision,
      undefined,
      this,
    );

    if (this.chestLog) this.faune.setChestLog(this.chestLog);
    this.faune.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 580, 805);
    this.cameras.main.startFollow(this.faune, true);
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack();
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }

    if (this.faune.body.y > 780) {
      const dataToPass = {
        chestLog: this.faune.getChestLog(),
        score: this.faune.getScore(),
        coins: this.faune.getCoins(),
        health: this.faune.getHealth(),
        position: { x: 606, y: 570 },
        gameLog: this.faune.getGameLog(),
        looking: 'down',
      };
      if (getSystemAudio().music) this.roomMedley.stop();
      this.scene.start(Handler.scenes.town, { dataToPass });
    }
  }
}
