// Mobile Haptic Feedback Utility (Safe across iOS / Android / Desktop)

export function hapticSuccess(): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50); // Short crisp tap for correct answer
    }
  } catch {}
}

export function hapticError(): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120, 60, 180]); // Long distinct double buzz for errors
    }
  } catch {}
}

export function hapticLevelUp(): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80, 60, 120, 60, 200]); // Festive ascending rhythm for level up
    }
  } catch {}
}
