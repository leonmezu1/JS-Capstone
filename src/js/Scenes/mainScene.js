import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Lizards from '../gameObjects/enemies/lizards';
import createLizardAnims from '../gameObjects/anims/enemyAnims';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
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
    this.faune.handleDamage(dx, dy);
    this.hit = 1;
  }


  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createFauneAnims(this.anims);
    createLizardAnims(this.anims);

    const map = this.make.tilemap({ key: 'dungeon_map' });
    const tileset = map.addTilesetImage('dungeon_tileset', 'dungeon_tile', 16, 16, 1, 2);

    map.createStaticLayer('Floor', tileset);
    const wallLayers = map.createStaticLayer('Walls', tileset);

    wallLayers.setCollisionByProperty({ collides: true });
    debugDraw(wallLayers, this);

    this.faune = new Faune(this, 660, 240, 'faune');
    const lizards = this.physics.add.group({
      classType: Lizards,
      createCallback: (go) => {
        const lizGo = go;
        lizGo.body.onCollide = true;
      },
    });
    lizards.get(660, 280, 'lizard');

    this.physics.add.collider(this.faune, wallLayers);
    this.physics.add.collider(lizards, wallLayers);
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