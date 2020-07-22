import Phaser from 'phaser';

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setSize(this.body.width * 0.5, this.body.height * 0.8);
    scene.add.existing(this);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}
