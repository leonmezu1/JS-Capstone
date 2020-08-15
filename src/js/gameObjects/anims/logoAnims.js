const logoAnims = (anims) => {
  anims.create({
    key: 'phaser-anim',
    frames: anims.generateFrameNumbers('phaserIntro', {
      start: 1,
      end: 59,
    }),
    frameRate: 15,
  });

  anims.create({
    key: 'microverse-anim',
    frames: anims.generateFrameNumbers('microverseIntro', {
      start: 3,
      end: 57,
    }),
    frameRate: 15,
  });

  anims.create({
    key: 'github-anim',
    frames: anims.generateFrameNumbers('githubIntro', {
      start: 3,
      end: 60,
    }),
    frameRate: 15,
  });
};

export default logoAnims;