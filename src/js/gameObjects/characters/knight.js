/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';

export default class Knight extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.anims.play('knight-idle');
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setSize(this.body.width * 0.9, this.body.height * 0.8);
    this.body.setImmovable();
    scene.add.existing(this);
  }
}