import Phaser from 'phaser';
import { Handler } from './scenesHandler';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.boot,
    });
  }

  preload() {
    this.width = this.game.renderer.width;
    this.height = this.game.renderer.height;
    this.load.audio('title_music', 'assets/audio/FreeRPGMusicTitleScreen.mp3');
    this.load.audio('warzone_music', 'assets/audio/FreeRPGMusicWarzone.mp3');
    this.load.audio('statistics_music', 'assets/audio/FreeRPGMusicStatistics.mp3');
    this.load.audio('town_music', 'assets/audio/FreeRPGMusicInTown.mp3');
    this.load.audio('horror_music', 'assets/audio/FreeRPGMusicHorror.mp3');
    this.load.audio('battle_music', 'assets/audio/FreeRPGMusicBattleTwo.mp3');
    this.load.audio('message', 'assets/audio/message.mp3');
    this.load.audio('swing', 'assets/audio/swing.mp3');
    this.load.audio('door', 'assets/audio/door.mp3');
    this.load.audio('gameOver', 'assets/audio/gameOver.mp3');
    this.load.audio('cursor', 'assets/audio/cursor.mp3');
    this.load.audio('enemyDies', 'assets/audio/enemyDies.mp3');
    this.load.audio('enemyHit', 'assets/audio/enemyHit.mp3');
    this.load.audio('fauneDies', 'assets/audio/fauneDies.mp3');
    this.load.audio('fauneHurt', 'assets/audio/fauneHurt.mp3');
    this.load.audio('select', 'assets/audio/select.mp3');
    this.load.audio('chestOpen', 'assets/audio/chestOpen.mp3');
    this.load.image('dungeon_tile', 'assets/sprites/0x72_DungeonTilesetII_v1.3_extruded.png');
    this.load.image('town_tile', 'assets/sprites/Overworld_extruded.png');
    this.load.image('castle_tile', 'assets/sprites/castle_2_extruded.png');
    this.load.image('stairs_tile', 'assets/sprites/stairs_1_extruded.png');
    this.load.image('room_tile', 'assets/sprites/Inner_extruded.png');
    this.load.image('full_heart', 'assets/public/ui/ui_heart_full.png');
    this.load.image('half_heart', 'assets/public/ui/ui_heart_half.png');
    this.load.image('empty_heart', 'assets/public/ui/ui_heart_empty.png');
    this.load.image('knife', 'assets/public/weapons/weapon_knife.png');
    this.load.image('switchLeft', 'assets/public/items/crank_left.png');
    this.load.image('switchRight', 'assets/public/items/crank_right.png');
    this.load.image('doorOpen', 'assets/public/items/doors_leaf_open.png');
    this.load.image('doorClosed', 'assets/public/items/doors_leaf_closed.png');
    this.load.image('battleBg', 'assets/public/backgrounds/battleBack2.jpg');
    this.load.image('glass-panel', 'assets/public/ui/glassPanel.png');
    this.load.image('cursor-hand', 'assets/public/ui/cursor_hand.png');
    this.load.image('gameOverImage', 'assets/public/backgrounds/GameOver.png');
    this.load.image('victoryImage', 'assets/public/backgrounds/victory.png');
    this.load.atlas('lava', 'assets/sprites/lavafountain.png', 'assets/sprites/lavafountain_atlas.json');
    this.load.atlas('pikes', 'assets/sprites/pikes.png', 'assets/sprites/pikes_atlas.json');
    this.load.atlas('treasure', 'assets/public/items/treasure.png', 'assets/public/items/treasure.json');
    this.load.atlas('faune', 'assets/public/character/fauna.png', 'assets/public/character/fauna.json');
    this.load.atlas('elf', 'assets/public/character/elf_male.png', 'assets/public/character/elf_male_atlas.json');
    this.load.atlas('knight', 'assets/public/character/knight.png', 'assets/public/character/knight_atlas.json');
    this.load.atlas('necromancer', 'assets/public/enemies/necromancer.png', 'assets/public/enemies/necromancer_atlas.json');
    this.load.atlas('ogre', 'assets/public/enemies/ogre.png', 'assets/public/enemies/ogre_atlas.json');
    this.load.atlas('wizard', 'assets/public/character/wizard.png', 'assets/public/character/wizard_atlas.json');
    this.load.atlas('lizard', 'assets/public/enemies/lizard.png', 'assets/public/enemies/lizard.json');
    this.load.tilemapTiledJSON('dungeon_map', 'assets/maps/dungeon.json');
    this.load.tilemapTiledJSON('town_map', 'assets/maps/town.json');
    this.load.tilemapTiledJSON('fauneRoom_map', 'assets/maps/fauneHouse.json');
    this.load.tilemapTiledJSON('topRightHouse_map', 'assets/maps/topRightHouse.json');
    this.load.tilemapTiledJSON('bottomLeftHouse_map', 'assets/maps/bottomLeftHouse.json');
    this.load.tilemapTiledJSON('bottomRightHouse_map', 'assets/maps/bottomRightHouse.json');
    this.load.tilemapTiledJSON('castle_map', 'assets/maps/castleInner.json');


    this.loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
        alpha: 0.5,
      },
    });
    this.loadingBarBox = this.add.graphics({
      fillStyle: {
        color: 0x222222,
        alpha: 0.8,
      },
      fillRect: {
        color: 0xf0ffff,
      },
    });

    this.loadingText = this.make.text({
      x: this.width / 2 - 180,
      y: 10,
      text: 'Loading game assets',
      style: {
        font: '16px Arial',
        fill: '#ffffff',
      },
    });

    this.percentageText = this.make.text({
      x: this.width / 2 - 15,
      y: this.height * (5 / 6) + 15,
      text: '0%',
      style: {
        font: '20px Arial',
        fill: '#000000',
      },
    });

    this.assetsText = this.make.text({
      x: this.width / 2,
      y: 10,
      text: '',
      style: {
        font: '16px Arial',
        fill: '#ffffff',
      },
    });

    const texts = [this.loadingText, this.percentageText, this.assetsText];

    texts.forEach(text => {
      text.setOrigin(0, 0);
    });

    this.load.on('progress', percentage => {
      this.add.image(200, 150, 'shieldBG').setScale(0.5).setDepth(-1);
      this.loadingBar.fillRect(0, this.height * (7 / 8), this.width * percentage, 50);
      this.percentageText.setText(`${parseInt(percentage * 100, 10)}%`);
    });

    this.load.on('fileprogress', (file) => {
      this.assetsText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on('complete', () => {
      setTimeout(() => {
        this.loadingBar.destroy();
        this.loadingBarBox.destroy();
        this.loadingText.destroy();
        this.percentageText.destroy();
        this.assetsText.destroy();
        this.scene.start(Handler.scenes.menu);
      }, 2500);
    });
  }
}
