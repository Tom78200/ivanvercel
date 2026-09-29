import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Lecteur audio natif HTML5
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.85;
    audio.preload = "auto";
    audioRef.current = audio;

    const tryPlay = () => {
      if (audioRef.current) {
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Autoplay restreint par la politique du navigateur avant premier geste
          });
        }
      }
    };

    // 1. Tenter la lecture immédiate
    tryPlay();

    // 2. Débloquer obligatoirement la lecture au moindre geste utilisateur (clic, toucher, défilement)
    const onUserGesture = () => {
      tryPlay();
    };

    window.addEventListener("click", onUserGesture, { passive: true });
    window.addEventListener("touchstart", onUserGesture, { passive: true });
    window.addEventListener("pointerdown", onUserGesture, { passive: true });
    window.addEventListener("scroll", onUserGesture, { passive: true });
    window.addEventListener("keydown", onUserGesture, { passive: true });

    // 3. Surveillance pour garantir que l'ambiance ne s'arrête jamais
    const keepPlayingInterval = setInterval(() => {
      if (audioRef.current && audioRef.current.paused) {
        tryPlay();
      }
    }, 2500);

    return () => {
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      clearInterval(keepPlayingInterval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // Aucun élément visuel affiché : son natif permanent et obligatoire
  return null;
}
