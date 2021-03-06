/* eslint-disable import/no-unresolved */

import Phaser from 'phaser';

export default class Crank extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'switchRight');
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.body.setSize(this.body.width * 1, this.body.height * 1);
    this.identifier = '';
  }

  setName(name) {
    this.identifier = name;
  }

  getName() {
    return this.identifier;
  }

  activate() {
    this.setTexture('switchLeft');
  }
}