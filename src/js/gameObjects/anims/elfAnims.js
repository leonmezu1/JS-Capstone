const createElfAnims = (anims) => {
  anims.create({
    key: 'elf-run',
    frames: anims.generateFrameNames('elf', {
      start: 0,
      end: 3,
      prefix: 'elf_m_run_anim_f',
    }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'elf-idle',
    frames: anims.generateFrameNames('elf', {
      start: 0,
      end: 3,
      prefix: 'elf_m_idle_anim_f',
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: 'elf-hit',
    frames: anims.generateFrameNames('elf', {
      start: 0,
      end: 0,
      prefix: 'elf_m_hit_anim_f',
    }),
    frameRate: 15,
  });
};

export default createElfAnims;