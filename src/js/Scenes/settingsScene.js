import Phaser from 'phaser';
import { getSystemAudio, setSystemAudio } from '../utils/localStorage';
import { Handler } from './scenesHandler';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.settings,
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
      index = 2;
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
    this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1).setTint(0x3B3A40);

    this.settings = getSystemAudio();

    const { width, height } = this.scale;

    const musicON = this.add.image(width * 0.5, height * 0.2, 'glass-panel')
      .setDisplaySize(150, 50);

    this.musicFlag = this.add.text(musicON.x, musicON.y, this.settings.music ? 'Music: On' : 'Music: Off')
      .setOrigin(0.5);

    const soundsON = this.add.image(musicON.x, musicON.y + musicON.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50);

    this.soundFlag = this.add.text(soundsON.x, soundsON.y, this.settings.sounds ? 'Sound: On' : 'Sound: Off')
      .setOrigin(0.5, 0.5);

    const returnButton = this.add.image(soundsON.x, soundsON.y + soundsON.displayHeight + 60, 'glass-panel')
      .setDisplaySize(150, 50);

    this.returnFlag = this.add.text(returnButton.x, returnButton.y, 'Return')
      .setOrigin(0.5, 0.5);

    this.buttons.push(musicON);
    this.buttons.push(soundsON);
    this.buttons.push(returnButton);

    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
    this.selectButton(2);

    musicON.on('selected', () => {
      if (this.musicFlag.text === 'Music: On') {
        this.musicFlag.setText('Music: Off');
        if (this.soundFlag.text === 'Sound: On') {
          this.settings.music = false;
          this.settings.sounds = true;
        } else {
          this.settings.music = false;
          this.settings.sounds = false;
        }
        setSystemAudio(this.settings);
      } else {
        this.musicFlag.setText('Music: On');
        if (this.soundFlag.text === 'Sound: On') {
          this.settings.music = true;
          this.settings.sounds = true;
        } else {
          this.settings.music = true;
          this.settings.sounds = false;
        }
        setSystemAudio(this.settings);
      }
    });

    soundsON.on('selected', () => {
      if (this.soundFlag.text === 'Sound: On') {
        this.soundFlag.setText('Sound: Off');
        if (this.musicFlag.text === 'Music: On') {
          this.settings.music = true;
          this.settings.sounds = false;
        } else {
          this.settings.music = false;
          this.settings.sounds = false;
        }
        setSystemAudio(this.settings);
      } else {
        this.soundFlag.setText('Sound: On');
        if (this.musicFlag.text === 'Music: On') {
          this.settings.music = true;
          this.settings.sounds = true;
        } else {
          this.settings.music = false;
          this.settings.sounds = true;
        }
        setSystemAudio(this.settings);
      }
    });

    returnButton.on('selected', () => {
      this.scene.switch(Handler.scenes.menu);
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