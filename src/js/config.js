import Phaser from 'phaser';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin';
import BattleScene from './Scenes/battleScene';
import BattleUIScene from './Scenes/battleUI';
import BootScene from './Scenes/bootScene';
import BottomLeftHouseScene from './Scenes/bottomLeftHouseScene';
import BottomRightHouseScene from './Scenes/bottomRightHouseScene';
import CastleScene from './Scenes/castleScene';
import DialogueScene from './Scenes/dialogue';
import FauneRoomScene from './Scenes/fauneRoomScene';
// import IntroScene from './Scenes/intro';
import MainScene from './Scenes/mainScene';
import TopRightHouseScene from './Scenes/topRightHouse';
import TownScene from './Scenes/townScene';
import UiScene from './Scenes/uiScene';
import MessageScene from './Scenes/messages';
import MenuScene from './Scenes/menu';
import SettingsScene from './Scenes/settingsScene';
import GameOverScene from './Scenes/gameOverScene';
import ScoresScenes from './Scenes/scoresScene';
import VictoryScene from './Scenes/victoryScene';
import CreditsScene from './Scenes/creditsScene';

const config = () => {
  const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    scene: [
      // IntroScene,
      BootScene,
      UiScene,
      DialogueScene,
      MainScene,
      TownScene,
      FauneRoomScene,
      BottomRightHouseScene,
      BottomLeftHouseScene,
      TopRightHouseScene,
      CastleScene,
      BattleScene,
      BattleUIScene,
      MessageScene,
      MenuScene,
      SettingsScene,
      GameOverScene,
      ScoresScenes,
      VictoryScene,
      CreditsScene,
    ],
    parent: 'gameContainer',
    dom: {
      createContainer: true,
    },
    plugins: {
      global: [
        {
          key: 'rexInputTextPlugin',
          plugin: InputTextPlugin,
          mapping: 'rexUI',
        },
      ],
    },
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
      zoom: 2,
    },
  };
  // eslint-disable-next-line no-unused-vars
  const game = new Phaser.Game(config);
};

export default config;
