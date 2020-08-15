const { getSystemAudio, setSystemAudio } = require('../js/utils/localStorage');

describe('It should handle the game sound vars', () => {
  test('It should set system sounds to ON/OFF', () => {
    setSystemAudio({ music: true, sound: true });
    expect(getSystemAudio().sound).toBe(true);
  });
  test('It should set system sounds to ON/OFF', () => {
    setSystemAudio({ music: true, sound: false });
    expect(getSystemAudio().sound).toBe(false);
  });
  test('It should set system sounds to ON/OFF', () => {
    setSystemAudio({ music: true, sound: false });
    expect(getSystemAudio().music).toBe(true);
  });
  test('It should set system sounds to ON/OFF', () => {
    setSystemAudio({ music: false, sound: false });
    expect(getSystemAudio().music).toBe(false);
  });
});
