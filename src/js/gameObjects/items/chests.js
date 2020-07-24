import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.coins = Phaser.Math.Between(5, 50);
    this.hearts = Phaser.Math.Between(0, 1, 2);
    this.anims.play('chest-closed');
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.body.setSize(this.body.width * 0.7, this.body.height * 0.7);
  }

  open() {
    let items;
    if (this.anims.currentAnim) {
      if (this.anims.currentAnim.key !== 'chest-closed') {
        items = [0, 0];
      } else {
        this.anims.play('chest-open');
        items = [this.coins, this.hearts];
      }
    }
    return items;
  }
}
