const createPikeAnims = (anims) => {
  anims.create({
    key: 'piking',
    frames: anims.generateFrameNames('pikes', {
      start: 353, end: 356, prefix: 'test_',
    }),
    frameRate: 10,
    repeat: -1,
  });
};

export default createPikeAnims;