import Phaser from 'phaser';
import { Handler } from './scenesHandler';
import logoAnims from '../gameObjects/anims/logoAnims';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.intro,
    });
  }

  preload() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
    this.load.image('shieldBG', 'assets/intro/loadingBackGroundNew.png');
    this.load.spritesheet(
      'phaserIntro',
      'assets/intro/phaserSprite.png ',
      {
        frameHeight: 514,
        frameWidth: 600,
      },
      2,
    );
    this.load.spritesheet(
      'microverseIntro',
      'assets/intro/microverseSprite.png',
      {
        frameHeight: 130,
        frameWidth: 600,
      },
      3,
    );
    this.load.spritesheet(
      'githubIntro',
      'assets/intro/githubSprite.png ',
      {
        frameHeight: 450,
        frameWidth: 600,
      },
      3,
    );
  }

  create() {
    logoAnims(this.anims);

    this.logo = this.add.sprite(
      this.width / 2,
      this.height / 2,
      'phaserLogo',
    ).setScale(0.5);

    this.logo.play('phaser-anim');
    this.logo.on('animationcomplete', () => {
      this.logo.destroy();

      this.microverse = this.add.sprite(
        this.width / 2,
        this.height / 2,
        'microverseIntro',
      ).setScale(0.5);

      this.microverse.play('microverse-anim');
      this.microverse.on('animationcomplete', () => {
        this.microverse.destroy();
        this.github = this.add.sprite(
          this.width / 2,
          this.height / 2,
          'githubIntro',
        ).setScale(0.5);

        this.github.play('github-anim');
        this.github.on('animationcomplete', () => {
          this.github.destroy();
          this.scene.start(Handler.scenes.boot);
        });
      });
    });
  }
}