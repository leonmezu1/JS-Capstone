/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';

export default class LavaFountains extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.anims.play('lavaAnim');
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
  }
}
