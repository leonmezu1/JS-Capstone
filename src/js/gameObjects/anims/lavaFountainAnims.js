const createLavaAnims = (anims) => {
  anims.create({
    key: 'lavaAnim',
    frames: anims.generateFrameNames('lava', {
      start: 0, end: 2, prefix: 'lava_',
    }),
    frameRate: 10,
    repeat: -1,
  });
};

export default createLavaAnims;