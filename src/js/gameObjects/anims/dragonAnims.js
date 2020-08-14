const createDragonAnims = (anims) => {
  anims.create({
    key: 'dragon-down',
    frames: anims.generateFrameNames('reddragon', {
      prefix: 'reddragonflydown_',
      start: 0,
      end: 14,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: 'dragon-up',
    frames: anims.generateFrameNames('reddragon', {
      prefix: 'reddragonflyup_',
      start: 0,
      end: 14,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: 'dragon-left',
    frames: anims.generateFrameNames('reddragon', {
      prefix: 'reddragonflyleft_',
      start: 0,
      end: 14,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: 'dragon-right',
    frames: anims.generateFrameNames('reddragon', {
      prefix: 'reddragonflyright_',
      start: 0,
      end: 14,
    }),
    frameRate: 10,
    repeat: -1,
  });
};

export default createDragonAnims;