import Phaser from 'phaser';
import { getSystemAudio } from '../utils/localStorage';
import { Handler } from './scenesHandler';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.credits,
    });
    this.buttons = [];
    this.selectedButtonIndex = 0;
    this.buttonSelector = Phaser.GameObjects.Image;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  selectButton(index) {
    const currentButton = this.buttons[this.selectedButtonIndex];
    currentButton.setTint(0xffffff);
    const button = this.buttons[index];
    button.setTint(0x66ff7f);
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
    this.buttonSelector.y = button.y + 10;
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }
    if (getSystemAudio().sounds) this.sound.play('cursor');
    this.selectButton(index);
  }

  confirmSelection() {
    const button = this.buttons[this.selectedButtonIndex];
    if (getSystemAudio().sounds) this.sound.play('select');
    button.emit('selected');
  }

  create() {
    if (getSystemAudio().music) {
      this.Medley = this.sound.add('statistics_music', {
        mute: false,
        volume: 0.225,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      });
      this.Medley.play();
    }
    this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1).setTint(0x3B3A40);

    const { width, height } = this.scale;

    this.add.text(
      width * 0.5,
      height * 0.4,
      'All the resources used to develop this software will be listed in this space in future realeases, THANK YOU.',
      {
        color: '#ffffff', fontStretch: 1, align: 'center', fontSize: 16, wordWrap: { width: 250, useAdvancedWrap: true },
      },
    ).setOrigin(0.5);

    this.submitButton = this.add.image(width * 0.5, height * 0.75, 'glass-panel')
      .setDisplaySize(150, 30);

    this.add.text(this.submitButton.x, this.submitButton.y, 'Menu')
      .setOrigin(0.5);

    this.buttons.push(this.submitButton);

    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
    this.selectButton(0);
    this.submitButton.on('selected', () => {
      setTimeout(() => {
        if (getSystemAudio().music) this.Medley.stop();
        this.scene.start(Handler.scenes.menu);
      }, 500);
    });
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (spaceJustPressed) {
      this.confirmSelection();
    }
  }
}