import Phaser from 'phaser';
import { getSystemAudio } from '../utils/localStorage';
import { Handler } from './scenesHandler';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.menu,
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
    const { width, height } = this.scale;

    const playButton = this.add.image(width * 0.5, height * 0.2, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(playButton.x, playButton.y, 'Play')
      .setOrigin(0.5);

    const settingsButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(settingsButton.x, settingsButton.y, 'Settings')
      .setOrigin(0.5);

    const creditsButton = this.add.image(settingsButton.x, settingsButton.y + settingsButton.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(creditsButton.x, creditsButton.y, 'Credits')
      .setOrigin(0.5);

    const scoresButton = this.add.image(creditsButton.x, creditsButton.y + creditsButton.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(scoresButton.x, scoresButton.y, 'Scores')
      .setOrigin(0.5);

    this.buttons.push(playButton);
    this.buttons.push(settingsButton);
    this.buttons.push(creditsButton);
    this.buttons.push(scoresButton);

    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
    this.selectButton(0);
    playButton.on('selected', () => {
      this.scene.start(Handler.scenes.fauneRoom);
    });

    settingsButton.on('selected', () => {
      this.scene.switch(Handler.scenes.settings);
    });

    creditsButton.on('selected', () => {
      this.scene.start(Handler.scenes.credits);
    });

    scoresButton.on('selected', () => {
      this.scene.start(Handler.scenes.scores);
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off('selected');
      settingsButton.off('selected');
      creditsButton.off('selected');
      scoresButton.off('selected');
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