import Phaser from 'phaser';
import { Handler } from '../../Scenes/scenesHandler';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.coins = Phaser.Math.Between(5, 50);
    this.hearts = Phaser.Math.Between(0, 1, 2);
    this.anims.play('chest-closed');
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.body.setSize(this.body.width * 0.7, this.body.height * 0.7);
    this.identifier = undefined;
  }

  setID(id) {
    this.identifier = id;
  }

  getID() {
    return this.identifier;
  }

  opened() {
    this.anims.play('chest-open');
  }

  closed() {
    this.anims.play('chest-closed');
  }

  open() {
    let items;
    if (this.anims.currentAnim) {
      if (this.anims.currentAnim.key === 'chest-closed') {
        this.anims.play('chest-open');
        items = [this.coins, this.hearts];
        const dialogData = {
          diagText: `You found ${this.coins} coins and ${this.hearts} hearts`,
          diagMode: 'temporized',
        };
        if (this.scene.scene.isActive(Handler.scenes.dialogue)) {
          this.scene.scene.stop(Handler.scenes.dialogue);
        }
        this.scene.scene.run(Handler.scenes.dialogue, { dialogData });
      } else {
        const dialogData = {
          diagText: 'This chest has been opened',
          diagMode: 'temporized',
        };
        if (this.scene.scene.isActive(Handler.scenes.dialogue)) {
          this.scene.scene.stop(Handler.scenes.dialogue);
        }
        this.scene.scene.run(Handler.scenes.dialogue, { dialogData });
        items = [0, 0];
      }
    }
    return items;
  }
}
