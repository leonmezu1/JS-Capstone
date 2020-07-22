import Phaser from 'phaser';

export default class Lizards extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame = null) {
    super(scene, x, y, texture, frame);
  }
}