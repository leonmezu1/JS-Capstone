import Phaser from 'phaser';
import { getData } from '../utils/fetchApi';
import { getSystemAudio } from '../utils/localStorage';
import { Handler } from './scenesHandler';

export default class ScoresScenes extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.scores,
    });
    this.delayItems = 0;
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
    this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1).setTint(0x3B3A40);
    const { width } = this.scale;
    let height = 50;
    const menuButton = this.add.image(width * 0.8, height + 8, 'glass-panel')
      .setDisplaySize(70, 30);

    this.add.text(menuButton.x, menuButton.y, 'Menu')
      .setOrigin(0.5);

    try {
      getData().then(data => {
        data = data.result;
        data.sort((a, b) => b.score - a.score);
        data = data.slice(0, 20);
        Object.keys(data).forEach((score, index) => {
          this.img = this.add.image(width * 0.30, height + 8, 'glass-panel').setDisplaySize(220, 30);
          this.lbl = this.add.text(
            this.img.x - (this.img.width / 2) - 20,
            height,
            `${index + 1}.`,
            {
              fill: '#ffffff',
            },
          );
          this.display = this.add.text(
            this.lbl.x + this.lbl.width,
            height,
            `${data[score].user} : ${data[score].score}`,
            {
              fill: '#ffffff',
            },
          );
          height += 50;
          this.delayItems += 1;
        });
      });
    } catch (e) {
      this.results = ['Failed to retrieve information'];
    }
    this.buttons.push(menuButton);
    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
    this.selectButton(0);
    menuButton.on('selected', () => {
      if (getSystemAudio().music) this.Medley.stop();
      this.scene.start(Handler.scenes.menu);
    });
  }

  update() {
    const upDown = this.cursors.up.isDown;
    const downDown = this.cursors.down.isDown;
    const spaceDown = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const rightDown = Phaser.Input.Keyboard.JustDown(this.cursors.right);
    const leftDown = Phaser.Input.Keyboard.JustDown(this.cursors.left);
    if (upDown) {
      this.cameras.main.pan(this.scale.width * 0.5, this.scale.height * 0.5 - 10);
      if (this.cameras.main.scrollY <= 0) {
        this.cameras.main.scrollY = 0;
      }
    } else if (downDown) {
      this.cameras.main.pan(this.scale.width * 0.5, this.display.y, this.delayItems * 200);
    } else if (spaceDown) {
      this.confirmSelection();
    } else if (leftDown) {
      this.selectNextButton(1);
    } else if (rightDown) {
      this.selectNextButton(-1);
    }
  }
}