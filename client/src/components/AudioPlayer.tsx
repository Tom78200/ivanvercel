import { useEffect } from "react";

declare global {
  interface Window {
    __ambientAudio?: HTMLAudioElement;
  }
}

export default function AudioPlayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.__ambientAudio) {
      const audio = new Audio("/audio/ambient.mp3");
      audio.id = "ambient-audio";
      audio.loop = true;
      audio.volume = 0.85;
      audio.preload = "auto";
      window.__ambientAudio = audio;
    }

    const audio = window.__ambientAudio;

    const startAudio = () => {
      if (!audio) return;
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            audio.muted = false;
            audio.volume = 0.85;
          })
          .catch(() => {
            // Lecture immédiate en mode muet pour charger le flux en continu
            audio.muted = true;
            audio.play().catch(() => {});
          });
      }
    };

    const unmuteAndPlay = () => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = 0.85;
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    // 1. Tenter la lecture immédiate dès le chargement
    startAudio();

    // 2. Écouteurs ultra-sensibles (mouvement de souris, défilement, toucher, frappe, etc.)
    const gestureEvents = [
      "mousemove",
      "pointermove",
      "scroll",
      "wheel",
      "touchstart",
      "touchend",
      "touchmove",
      "click",
      "mousedown",
      "keydown",
      "focus",
      "mouseenter",
      "visibilitychange",
      "pageshow"
    ];

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, unmuteAndPlay, { passive: true, capture: true });
      document.addEventListener(evt, unmuteAndPlay, { passive: true, capture: true });
    });

    // 3. Boucle de maintien automatique (toutes les secondes)
    const heartbeat = setInterval(() => {
      if (audio) {
        if (audio.paused) {
          unmuteAndPlay();
        }
      }
    }, 1200);

    return () => {
      clearInterval(heartbeat);
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, unmuteAndPlay, true);
        document.removeEventListener(evt, unmuteAndPlay, true);
      });
    };
  }, []);

  return null;
}


