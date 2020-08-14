import Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import { postData } from '../utils/fetchApi';
import { getSystemAudio } from '../utils/localStorage';
import { Handler } from './scenesHandler';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.gameOver,
    });
    this.buttons = [];
    this.selectedButtonIndex = 0;
    this.buttonSelector = Phaser.GameObjects.Image;
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initCoins = data.dataToPass.coins;
    } else {
      this.dataProvided = false;
    }
  }

  selectButton(index) {
    const button = this.buttons[index];
    const currentButton = this.buttons[this.selectedButtonIndex];
    currentButton.setTint(0xffffff);
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
    const button = this.buttons[0];
    if (getSystemAudio().sounds) this.sound.play('select');
    button.emit('selected');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  submit() {
    if (this.inputText.text === '') {
      this.inputText.placeholder = 'Name field can\'t be empty';
    } else if (this.inputText.text.length < 3) {
      this.inputText.text = '';
      this.inputText.placeholder = 'Name field lenght must be > 2';
    } else {
      postData({ user: this.inputText.text, score: this.initScore + this.initCoins });
      this.cameras.main.fadeOut(500, 0, 0, 0, 0);
      setTimeout(() => {
        if (getSystemAudio().music) this.Medley.stop();
        this.scene.start(Handler.scenes.scores);
      }, 1500);
    }
  }

  create() {
    if (this.scene.isActive('BattleUIScene')) this.scene.stop('BattleUIScene');
    if (!this.dataProvided) {
      this.initScore = 10;
      this.initCoins = 10;
    }
    if (getSystemAudio().music === true) this.sound.stopAll();
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

    const { width, height } = this.scale;

    this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1).setTint(0x3B3A40);

    this.add.image(width * 0.5, height * 0.25, 'gameOverImage')
      .setScale(0.2);

    this.inputText = new InputText(
      this,
      width * 0.3,
      height * 0.30,
      200,
      30,
      {
        placeholder: 'Type your name',
        color: '#ffffff',
        border: 1,
        backgroundColor: 'transparent',
        fontSize: 14,
      },
    ).setOrigin(0.5);
    this.add.existing(this.inputText);
    this.submitButton = this.add.image(width * 0.5, height * 0.75, 'glass-panel')
      .setDisplaySize(150, 30);

    this.add.text(this.submitButton.x, this.submitButton.y, 'Submit')
      .setOrigin(0.5);

    this.buttons.push(this.submitButton);


    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
    this.selectButton(0);
    this.inputText.setFocus();
    this.submitButton.on('selected', () => {
      this.submit();
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