import confetti from 'canvas-confetti';

/**
 * Triggers a confetti animation with green theme
 * @param origin - Optional origin point for confetti (x, y coordinates from 0-1)
 */
export const triggerConfetti = (origin?: { x: number; y: number }) => {
  const defaults = {
    colors: ['#22c55e', '#16a34a', '#15803d', '#86efac', '#4ade80'],
    particleCount: 100,
    spread: 70,
    origin: origin || { x: 0.5, y: 0.5 },
  };

  confetti({
    ...defaults,
    angle: 60,
    particleCount: 50,
  });

  confetti({
    ...defaults,
    angle: 120,
    particleCount: 50,
  });
};

/**
 * Triggers a burst confetti animation from a specific element
 * @param element - The DOM element to burst confetti from
 */
export const triggerConfettiFromElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  triggerConfetti({ x, y });
};

/**
 * Triggers a continuous confetti shower
 * @param duration - Duration in milliseconds (default: 2000ms)
 */
export const triggerConfettiShower = (duration: number = 2000) => {
  const end = Date.now() + duration;

  const colors = ['#22c55e', '#16a34a', '#15803d', '#86efac', '#4ade80'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

