export const setSystemAudio = (audioConfigObject) => {
  localStorage.setItem('sysAudio', JSON.stringify(audioConfigObject));
};

export const getSystemAudio = () => {
  const system = localStorage.getItem('sysAudio') === null ? { music: true, sounds: true } && setSystemAudio({ music: true, sounds: true }) : JSON.parse(localStorage.getItem('sysAudio'));
  return system;
};