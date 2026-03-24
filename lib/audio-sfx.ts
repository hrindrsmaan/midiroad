"use client";

/**
 * Utility to play short UI sound effects.
 * Best used with small (<100kb) mp3/wav files.
 */
export const playSFX = (type: 'hover' | 'click') => {
  if (typeof window === 'undefined') return;

  const audio = new Audio(`/audio/${type}.wav`);
  audio.volume = type === 'hover' ? 0.2 : 0.4; // Hover is subtle, Click is punchy
  
  // Play and ignore the promise result to avoid 'uncaught in promise' errors 
  // if the user hasn't interacted with the page yet.
  audio.play().catch(() => {
    /* Ignore autoplay block */
  });
};
