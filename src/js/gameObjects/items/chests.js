import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play('chest-closed');
    this.quantity = Phaser.Math.Between(1, 3);
  }

  getHearts() {
    if (!this.anims.currentAnim) return;
    if (this.anims.currentAnim.key !== 'chest-closed') {
      this.quantity = 0;
    }
  }

  open() {
    this.anims.play('chest-open');
  }
}
