const necromancerAnims = (anims) => {
  anims.create({
    key: 'necromancer-run',
    frames: anims.generateFrameNames('necromancer', {
      start: 0,
      end: 3,
      prefix: 'necromancer_run_anim_f',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'necro-idle',
    frames: anims.generateFrameNames('necromancer', {
      start: 0,
      end: 3,
      prefix: 'necromancer_idle_anim_f',
    }),
    frameRate: 15,
    repeat: -1,
  });
};

export default necromancerAnims;