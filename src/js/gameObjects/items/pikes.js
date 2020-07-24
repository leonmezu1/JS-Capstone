import Phaser from 'phaser';

export default class Pikes extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.anims.play('piking');
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.body.setSize(this.body.width * 0.5, this.body.height * 0.5);
  }
}