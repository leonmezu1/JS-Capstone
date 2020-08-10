export const fadeOutEffect = (el, interval) => {
  const fadeEffect = setInterval(() => {
    if (!el.style.opacity) {
      el.style.opacity = 1;
    }
    if (el.style.opacity > 0) {
      el.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, interval);
};

export const fadeInEffect = (el, interval) => {
  el.style.opacity = 0;
  const fadeEffect = setInterval(() => {
    if (el.style.opacity < 1) {
      el.style.opacity = parseFloat(el.style.opacity) + 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, interval);
};