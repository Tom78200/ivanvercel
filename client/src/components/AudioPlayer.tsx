declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: {
      Player: {
        new (elementId: string, config: {
          height: string | number;
          width: string | number;
          videoId: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            loop?: number;
            playlist?: string;
            playsinline?: number;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }): {
          playVideo: () => void;
          pauseVideo: () => void;
          destroy: () => void;
          getPlayerState: () => number;
        };
      };
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  getPlayerState?: () => number;
};

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    // 1. Créer le conteneur DOM invisible pour l'iframe YouTube
    let playerContainer = document.getElementById('youtube-player');
    if (!playerContainer) {
      playerContainer = document.createElement('div');
      playerContainer.id = 'youtube-player';
      playerContainer.style.position = 'fixed';
      playerContainer.style.left = '-9999px';
      playerContainer.style.top = '-9999px';
      playerContainer.style.width = '1px';
      playerContainer.style.height = '1px';
      playerContainer.style.opacity = '0';
      playerContainer.style.pointerEvents = 'none';
      document.body.appendChild(playerContainer);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const player = new window.YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'YRu6NK19VkQ',
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'YRu6NK19VkQ',
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            try {
              event.target.playVideo();
            } catch {}
          },
          onStateChange: (event: { data: number }) => {
            // YouTube: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
          }
        }
      });

      playerRef.current = player;
    };

    // 2. Charger le script iframe_api si pas déjà présent
    if (!window.YT) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    // 3. Débloquer la lecture audio au premier clic ou toucher de l'utilisateur (politique autoplay navigateurs)
    const handleFirstUserInteraction = () => {
      if (playerRef.current) {
        try {
          playerRef.current.playVideo();
        } catch {}
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Audio toggle failed:", e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        onClick={togglePlay}
        className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:bg-black/90 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        title={isPlaying ? "Désactiver la musique d'ambiance" : "Activer la musique d'ambiance"}
        aria-label={isPlaying ? "Désactiver la musique d'ambiance" : "Activer la musique d'ambiance"}
      >
        {/* Anneau pulsant subtil en lecture */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-white/30 animate-ping pointer-events-none opacity-40" />
        )}

        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-white"
            >
              <Volume2 className="w-5 h-5 text-white/90" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-white/60 group-hover:text-white"
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info-bulle discrète au survol */}
        <span className="hidden sm:block absolute right-full mr-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md text-[11px] uppercase tracking-wider text-white/80 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10 shadow-lg">
          {isPlaying ? "Ambiance sonore : Active" : "Ambiance sonore : Coupée"}
        </span>
      </motion.button>
    </div>
  );
}
