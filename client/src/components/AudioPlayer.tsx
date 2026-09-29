import { useEffect } from "react";

declare global {
  interface Window {
    __ambientAudio?: HTMLAudioElement;
  }
}

export default function AudioPlayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Singleton audio global persistant
    if (!window.__ambientAudio) {
      const audio = new Audio("/audio/ambient.mp3");
      audio.id = "ambient-audio";
      audio.loop = true;
      audio.volume = 0.85;
      audio.preload = "auto";
      window.__ambientAudio = audio;
    }

    const audio = window.__ambientAudio;

    const playSafe = () => {
      if (audio && audio.paused) {
        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // En attente du déblocage navigateur par geste
          });
        }
      }
    };

    // 1. Tenter la lecture immédiate dès le montage
    playSafe();

    // 2. Déclencheurs ultra-réactifs au moindre contact (toucher, clic, scroll, frappe, focus)
    const gestureEvents = [
      "click",
      "pointerdown",
      "touchstart",
      "touchend",
      "touchmove",
      "scroll",
      "wheel",
      "mousemove",
      "keydown",
      "visibilitychange",
      "focus"
    ];

    const handleGesture = () => {
      playSafe();
    };

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { passive: true, capture: true });
      document.addEventListener(evt, handleGesture, { passive: true, capture: true });
    });

    // 3. Heartbeat / boucle de surveillance permanente (toutes les 1.2s)
    const heartbeat = setInterval(() => {
      if (audio && audio.paused) {
        playSafe();
      }
    }, 1200);

    return () => {
      // Ne JAMAIS détruire ni mettre en pause le flux audio global lors des changements de pages
      clearInterval(heartbeat);
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGesture, true);
        document.removeEventListener(evt, handleGesture, true);
      });
    };
  }, []);

  return null;
}

