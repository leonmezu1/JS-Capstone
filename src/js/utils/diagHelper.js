const { Handler } = require('../Scenes/scenesHandler');

const promtDiag = (diagStringArray, timer, scene) => {
  diagStringArray.forEach((sentence, index) => {
    setTimeout(() => {
      const dialogData = {
        diagText: sentence,
        diagMode: 'temporized',
        timer,
      };
      if (scene.scene.isActive(Handler.scenes.dialogue)) {
        scene.scene.stop(Handler.scenes.dialogue);
      }
      scene.scene.run(Handler.scenes.dialogue, { dialogData });
    }, index * timer);
  });
};

export default promtDiag;