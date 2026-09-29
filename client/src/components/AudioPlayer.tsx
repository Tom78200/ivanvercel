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
          unMute: () => void;
          setVolume: (volume: number) => void;
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

import { useEffect, useRef } from "react";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  unMute?: () => void;
  setVolume?: (volume: number) => void;
  destroy: () => void;
  getPlayerState?: () => number;
};

export default function AudioPlayer() {
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

    const startPlayback = () => {
      if (playerRef.current) {
        try {
          if (playerRef.current.unMute) playerRef.current.unMute();
          if (playerRef.current.setVolume) playerRef.current.setVolume(100);
          playerRef.current.playVideo();
        } catch {}
      }
    };

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
            try {
              if (event.target.unMute) event.target.unMute();
              if (event.target.setVolume) event.target.setVolume(100);
              event.target.playVideo();
            } catch {}
          },
          onStateChange: (event: any) => {
            // Si la vidéo s'arrête ou se met en pause, forcer la reprise immédiate (lecture obligatoire en boucle)
            if (event?.data === 2 || event?.data === 0) {
              startPlayback();
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

    // 3. Débloquer la lecture audio au premier geste utilisateur (requis par les politiques autoplay des navigateurs)
    window.addEventListener('click', startPlayback);
    window.addEventListener('touchstart', startPlayback);
    window.addEventListener('pointerdown', startPlayback);
    window.addEventListener('keydown', startPlayback);

    // Vérification de sécurité pour maintenir la lecture active en permanence
    const keepAliveTimer = setInterval(() => {
      startPlayback();
    }, 4000);

    return () => {
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('touchstart', startPlayback);
      window.removeEventListener('pointerdown', startPlayback);
      window.removeEventListener('keydown', startPlayback);
      clearInterval(keepAliveTimer);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  // Aucun bouton ni contrôle UI : la musique joue obligatoirement en continu en arrière-plan
  return null;
}
