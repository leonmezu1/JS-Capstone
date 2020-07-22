import Phaser from 'phaser';
import BootScene from './Scenes/bootScene';
import MainScene from './Scenes/mainScene';

const config = () => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, MainScene],
    parent: 'gameContainer',
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        arcade: {
          debug: true,
        },
      },
    },
    render: {
      pixelArt: true,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const game = new Phaser.Game(config);
};

export default config;
