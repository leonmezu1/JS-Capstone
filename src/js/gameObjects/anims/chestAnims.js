const createChestAnims = (anims) => {
  anims.create({
    key: 'chest-open',
    frames: anims.generateFrameNames('treasure', {
      start: 0,
      end: 2,
      preffix: 'chest_empty_open_anim_f',
      suffix: '.png',
      frameRate: 5,
    }),
  });

  anims.create({
    key: 'chest-closed',
    frames: [{
      key: 'treasure',
      frame: 'chest_empty_open_anim_f0.png',
    }],
  });
};

export default createChestAnims;