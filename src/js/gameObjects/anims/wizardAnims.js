const wizardAnims = (anims) => {
  anims.create({
    key: 'wizard-run',
    frames: anims.generateFrameNames('wizard', {
      start: 0,
      end: 3,
      prefix: 'wizzard_m_run_anim_f',
    }),
    frameRate: 15,
  });

  anims.create({
    key: 'wizard-idle',
    frames: anims.generateFrameNumbers('wizard', {
      start: 0,
      end: 3,
      prefix: 'wizzard_m_idle_anim_f',
    }),
    frameRate: 15,
  });

  anims.create({
    key: 'wizard-hit',
    frames: anims.generateFrameNumbers('wizard', {
      start: 0,
      end: 0,
      prefix: 'wizzard_m_hit_anim_f',
    }),
    frameRate: 15,
  });
};

export default wizardAnims;