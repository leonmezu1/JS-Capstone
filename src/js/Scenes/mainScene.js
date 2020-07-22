import { Scene, Math } from 'phaser';
import { Handler } from './scenesHandler';
import Palas from '../gameObjects/palas';
import Bola from '../gameObjects/bola';

export default class MainScene extends Scene {
  constructor() {
    super({
      key: Handler.scenes.main,
    });
  }

  chochaPala() {
    this.ball.body.setVelocityY(Math.Between(-120, 120));
  }

  create() {
    const gameHeight = this.game.renderer.height;
    const gameWidth = this.game.renderer.width;
    this.add.image(gameWidth / 2, gameHeight / 2, 'separator').setScale(1.45);
    this.izquierda = new Palas(this, 50, gameHeight / 2, 'left');
    this.derecha = new Palas(this, gameWidth - 50, gameHeight / 2, 'right');
    this.ball = new Bola(this, 400, 300, 'ball');
    this.physics.add.collider(this.ball, this.izquierda, () => {
      this.chochaPala();
    });
    this.physics.add.collider(this.ball, this.derecha, () => {
      this.chochaPala();
    });
    this.cursor = this.input.keyboard.createCursorKeys();
    this.keyboard = this.input.keyboard.addKeys('W, A, S, D');
  }

  update() {
    if (this.ball.body.x < 0 || this.ball.body.x > 800) {
      this.ball.setPosition(400, 300);
    }

    if (this.cursor.down.isDown) {
      this.derecha.body.setVelocityY(300);
    } else if (this.cursor.up.isDown) {
      this.derecha.body.setVelocityY(-300);
    }

    if (this.keyboard.S.isDown) {
      this.izquierda.body.setVelocityY(300);
    } else if (this.keyboard.W.isDown) {
      this.izquierda.body.setVelocityY(-300);
    }

    if (this.keyboard.W.isUp && this.keyboard.S.isUp) {
      this.izquierda.body.setVelocityY(0);
    }

    if (this.cursor.up.isUp && this.cursor.down.isUp) {
      this.derecha.body.setVelocityY(0);
    }
  }
}