import { Handler } from '../Scenes/scenesHandler';

const turnBasedFight = (character, enemy, scene) => {
  const dataToPass = {
    score: character.getScore(),
    health: character.getHealth(),
    enemyType: enemy.characterType,
    parentScene: scene.scene.key,
  };
  enemy.destroy();
  scene.cameras.main.shake(300, 0.03);
  setTimeout(() => {
    scene.scene.sleep(scene);
    scene.scene.stop('BattleUIScene');
    if (scene.scene.isSleeping(Handler.scenes.battle)) scene.scene.stop(Handler.scenes.battle);
    scene.scene.launch(Handler.scenes.battle, { dataToPass });
  }, 300);
};

export default turnBasedFight;