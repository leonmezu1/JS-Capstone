import Phaser from 'phaser';

export default class Bola extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    scene.physics.world.setBoundsCollision(false, false, true, true);

    this.body.setVelocityX(200 * 1.5);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(1);
  }
}