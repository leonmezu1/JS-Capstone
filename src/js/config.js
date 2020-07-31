import Phaser from 'phaser';
import BootScene from './Scenes/bootScene';
import BottomLeftHouseScene from './Scenes/bottomLeftHouseScene';
import BottomRightHouseScene from './Scenes/bottomRightHouseScene';
import DialogueScene from './Scenes/dialogue';
import FauneRoomScene from './Scenes/fauneRoomScene';
import IntroScene from './Scenes/intro';
import MainScene from './Scenes/mainScene';
import TopRightHouseScene from './Scenes/topRightHouse';
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
      UiScene,
      DialogueScene,
      MainScene,
      TownScene,
      FauneRoomScene,
      BottomRightHouseScene,
      BottomLeftHouseScene,
      TopRightHouseScene,
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
      zoom: 2,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const game = new Phaser.Game(config);
};

export default config;
