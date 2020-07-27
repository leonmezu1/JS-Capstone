import Phaser from 'phaser';
import BootScene from './Scenes/bootScene';
import FauneRoomScene from './Scenes/fauneRoomScene';
import IntroScene from './Scenes/intro';
import MainScene from './Scenes/mainScene';
import TownScene from './Scenes/townScene';
import UiScene from './Scenes/uiScene';


const config = () => {
  const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: [
      IntroScene,
      BootScene,
      MainScene,
      UiScene,
      TownScene,
      FauneRoomScene,
    ],
    parent: 'gameContainer',
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
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
