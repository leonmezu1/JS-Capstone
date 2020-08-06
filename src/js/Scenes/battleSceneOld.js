import Phaser from 'phaser';
import { Handler } from './scenesHandler';

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.hp = hp;
      this.maxHp = this.hp;
      this.damage = damage; // default damage
    },
  attack(target) {
    target.takeDamage(this.damage);
  },
  takeDamage(damage) {
    this.hp -= damage;
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    },
});

const PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
      // flip the image so I don't have to edit it manually
      this.flipX = true;

      this.setScale(2);
    },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    },

  select() {
    this.setColor('#f8ff38');
  },

  deselect() {
    this.setColor('#ffffff');
  },

});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.heroes = heroes;
      this.x = x;
      this.y = y;
    },
  addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex -= 1;
    if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex += 1;
    if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    this.menuItems[this.menuItemIndex].select();
  },
  // select the menu as a whole and an element with index from it
  select(index) {
    if (!index) index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },
  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },
  confirm() {
    // wen the player confirms his slection, do the action
  },
  clear() {
    for (let i = 0; i < this.menuItems.length; i += 1) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i += 1) {
      const unit = units[i];
      this.addMenuItem(unit.type);
    }
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('Attack');
    },
  confirm() {
    this.scene.events.emit('SelectEnemies');
  },

});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  },
});

const Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
    function Message(scene, events) {
      Phaser.GameObjects.Container.call(this, scene, 160, 30);
      const graphics = this.scene.add.graphics();
      this.add(graphics);
      graphics.lineStyle(1, 0xffffff, 0.8);
      graphics.fillStyle(0x031f4c, 0.3);
      graphics.strokeRect(-90, -15, 180, 30);
      graphics.fillRect(-90, -15, 180, 30);
      this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
        color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true },
      });
      this.add(this.text);
      this.text.setOrigin(0.5);
      events.on('Message', this.showMessage, this);
      this.visible = false;
    },
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: this.hideMessage,
      callbackScope: this,
    });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: Handler.scenes.battle,
    });
    this.borderThickness = 3;
    this.borderColor = 0x907748;
    this.borderAlpha = 1;
    this.windowAlpha = 0.8;
    this.windowColor = 0x303030;
    this.windowHeight = 150;
    this.padding = 32;
    this.closeBtnColor = 'darkgoldenrod';
  }

  init(data) {
    if (data.dataToPass !== undefined) {
      this.dataProvided = true;
      this.initScore = data.dataToPass.score;
      this.initCoins = data.dataToPass.coins;
      this.initHealth = data.dataToPass.health;
      this.initPosition = data.dataToPass.position;
      this.initLooking = data.dataToPass.looking;
      this.chestLog = data.dataToPass.chestLog;
      this.gameLog = data.dataToPass.gameLog;
    } else {
      this.dataProvided = false;
    }
  }

  shutdown() {
    this.scene.stop(this);
  }

  destroy() {
    this.shutdown();
  }

  getGameWidth() {
    return this.game.renderer.width;
  }

  getGameHeight() {
    return this.game.renderer.height + 90;
  }

  calculateWindowDimensions(width, height) {
    const x = this.padding;
    const y = height - this.windowHeight - this.padding;
    const rectWidth = width - (this.padding * 2);
    const rectHeight = this.windowHeight / 2;
    return {
      x,
      y,
      rectWidth,
      rectHeight,
    };
  }

  createInnerWindow(x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  }

  createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  }

  createWindow() {
    const gameHeight = this.getGameHeight();
    const gameWidth = this.getGameWidth();
    const dimensions = this.calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.add.graphics();

    this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
  }

  nextTurn() {
    this.index += 1;
    // if there are no more units, we start again from the first one
    if (this.index >= this.units.length) {
      this.index = 0;
    }
    if (this.units[this.index]) {
      // if its player hero
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.onPlayerSelect(this.index);
      } else { // else if its enemy unit
        // pick random hero
        const r = Math.floor(Math.random() * this.heroes.length);
        // call the enemy's attack function
        this.units[this.index].attack(this.heroes[r]);
        // add timer for the next turn, so will have smooth gameplay
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  onKeyInput(event) {
    if (this.currentMenu) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      /* } else if (event.code === 'ArrowRight' || event.code === 'Shift') {

      */ } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }

  onEnemy(i) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.receivePlayerSelection('attack', i);
  }

  onPlayerSelect(identifier) {
    this.heroesMenu.select(identifier);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectEnemies() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  receivePlayerSelection(act, target) {
    if (act === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  remapHeroes() {
    const { heroes } = this;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    const { enemies } = this;
    this.enemiesMenu.remap(enemies);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run(Handler.scenes.ui);
    this.scene.sendToBack(this);
    this.createWindow();
    // player character - warrior
    const warrior = new PlayerCharacter(this, 250, 50, 'faune', 1, 'Faune', 600, 100);
    this.add.existing(warrior);

    const dragonblue = new Enemy(this, 50, 50, 'lizard', null, 'Lizard', 100, 100);
    this.add.existing(dragonblue);

    // array with heroes
    this.heroes = [warrior];
    // array with enemies
    this.enemies = [dragonblue];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);
    // basic container to hold all menus
    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);
    this.remapHeroes();
    this.remapEnemies();
    this.input.keyboard.on('keydown', this.onKeyInput, this);
    this.index = -1;
    this.events.on('SelectEnemies', this.onSelectEnemies, this);
    this.events.on('Enemy', this.onEnemy, this);
    this.nextTurn();
    this.message = new Message(this, this.events);
    this.add.existing(this.message);
  }
}