const ogreAnims = (anims) => {
  anims.create({
    key: 'ogre-run',
    frames: anims.generateFrameNames('ogre', {
      start: 0,
      end: 3,
      prefix: 'ogre_run_anim_f',
    }),
    frameRate: 15,
  });

  anims.create({
    key: 'ogre-idle',
    frames: anims.generateFrameNames('ogre', {
      start: 0,
      end: 3,
      prefix: 'ogre_idle_anim_f',
    }),
    frameRate: 15,
  });
};

export default ogreAnims;