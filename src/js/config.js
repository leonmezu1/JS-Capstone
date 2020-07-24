import Phaser from 'phaser';
import BootScene from './Scenes/bootScene';
import MainScene from './Scenes/mainScene';
import UiScene from './Scenes/uiScene';

const config = () => {
  const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: [BootScene, MainScene, UiScene],
    parent: 'gameContainer',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    render: {
      pixelArt: true,
    },
    scale: {
      zoom: 2.5,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const game = new Phaser.Game(config);
};

export default config;
