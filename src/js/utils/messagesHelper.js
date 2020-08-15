const promptMessage = (diagStringArray, timer, scene) => {
  diagStringArray.forEach((sentence, index) => {
    setTimeout(() => {
      const messageData = {
        messageText: sentence,
        messageMode: 'temporized',
        timer,
      };
      if (scene.scene.isActive('Message')) {
        scene.scene.stop('Message');
      }
      scene.scene.run('Message', { messageData });
    }, index * timer);
  });
};

export default promptMessage;