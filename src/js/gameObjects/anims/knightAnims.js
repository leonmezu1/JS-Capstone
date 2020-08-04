const createKnightAnims = (anims) => {
  anims.create({
    key: 'knight-run',
    frames: anims.generateFrameNames('knight', {
      start: 0,
      end: 3,
      prefix: 'knight_m_run_anim_f',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'knight-idle',
    frames: anims.generateFrameNames('knight', {
      start: 0,
      end: 3,
      prefix: 'knight_m_idle_anim_f',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'knight-hit',
    frames: anims.generateFrameNames('knight', {
      start: 0,
      end: 0,
      prefix: 'knight_m_hit_anim_f',
    }),
    frameRate: 15,
  });
};

export default createKnightAnims;