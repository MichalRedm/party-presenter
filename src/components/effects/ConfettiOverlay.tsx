import confetti from 'canvas-confetti';

export function firePartyConfetti(options?: { count?: number; spread?: number; originY?: number }): void {
  const count = options?.count || 120;
  const spread = options?.spread || 80;
  const originY = options?.originY ?? 0.6;

  try {
    // Left burst
    confetti({
      particleCount: Math.floor(count / 2),
      angle: 60,
      spread,
      origin: { x: 0.1, y: originY },
      colors: ['#a855f7', '#ec4899', '#eab308', '#06b6d4', '#10b981', '#f43f5e'],
    });

    // Right burst
    confetti({
      particleCount: Math.floor(count / 2),
      angle: 120,
      spread,
      origin: { x: 0.9, y: originY },
      colors: ['#a855f7', '#ec4899', '#eab308', '#06b6d4', '#10b981', '#f43f5e'],
    });

    // Center grand burst
    setTimeout(() => {
      confetti({
        particleCount: Math.floor(count * 0.7),
        spread: spread + 30,
        origin: { x: 0.5, y: originY - 0.1 },
        colors: ['#ffffff', '#eab308', '#ec4899', '#3b82f6'],
      });
    }, 200);
  } catch {
    // Safe guard in non-browser context
  }
}
