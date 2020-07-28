import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import debugDraw from '../utils/collisionDebugger';
import Faune from '../gameObjects/characters/faune';
import Chest from '../gameObjects/items/chests';
import createFauneAnims from '../gameObjects/anims/fauneAnims';
import createChestAnims from '../gameObjects/anims/chestAnims';

export default class TopRightHouseScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.topRightHouse,
    });
  }
}