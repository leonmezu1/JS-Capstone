import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Faune from '../gameObjects/characters/faune';

export default class FauneRoomScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.fauneRoom,
    });
  }

  create() {
    this.map = this.make.tilemap({ key: 'fauneRoom_map' });
    this.tileset = this.map.addTilesetImage('Inner', 'room_tile', 16, 16, 0, 0);
    this.floorLayer = this.map.createStaticLayer('Floor', this.tileset);
    this.objectsMiddleLayer = this.map.createStaticLayer('ObjectsMiddle', this.tileset);
    this.objectsLayer = this.map.createStaticLayer('Objects', this.tileset);
    this.objectsTopLayer = this.map.createStaticLayer('ObjectsTop', this.tileset);

    const layers = [
      this.floorLayer,
      this.objectsLayer,
      this.objectsMiddleLayer,
      this.objectsTopLayer,
    ];
  }
}