"use client";

import { useEffect, useState } from "react";

/**
 * Global component that plays a 'Producer Tag' once per session.
 * Browsers block audio until the FIRST user interaction, so we 
 * attach a one-time global click listener to trigger the tag.
 */
export function ProducerTag() {
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Check session storage to only play ONCE per visit
    const playedThisSession = sessionStorage.getItem("midiroad_tag_played");
    if (playedThisSession) {
      setHasPlayed(true);
      return;
    }

    // Define the playback function
    const playTag = () => {
      if (hasPlayed) return;

      const audio = new Audio("/audio/welcome_tag.mp3");
      audio.volume = 0.5;
      
      audio.play()
        .then(() => {
          sessionStorage.setItem("midiroad_tag_played", "true");
          setHasPlayed(true);
          cleanup();
        })
        .catch((err) => {
          // Blocked by browser
        });
    };

    const cleanup = () => {
      document.removeEventListener("click", playTag);
      document.removeEventListener("touchstart", playTag);
      document.removeEventListener("mousedown", playTag);
      document.removeEventListener("scroll", playTag);
    };

    // 1. Attempt immediately on load (will likely be blocked by browsers)
    playTag();

    // 2. Listen for the absolute first interaction anywhere as a fallback
    document.addEventListener("click", playTag);
    document.addEventListener("mousedown", playTag);
    document.addEventListener("touchstart", playTag, { passive: true });
    document.addEventListener("scroll", playTag, { passive: true });

    return () => cleanup();
  }, [hasPlayed]);

  return null; // Invisible component
}
