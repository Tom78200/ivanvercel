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
          };
          events?: {
            onStateChange?: (event: { data: number }) => void;
          };
        }): {
          playVideo: () => void;
          pauseVideo: () => void;
          destroy: () => void;
        };
      };
      PlayerState: {
        PLAYING: number;
      };
    };
  }
}

import { useEffect, useRef } from "react";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

export default function AudioPlayer() {
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    // Créer un div caché pour le player YouTube
    const playerContainer = document.createElement('div');
    playerContainer.id = 'youtube-player';
    playerContainer.style.position = 'absolute';
    playerContainer.style.left = '-9999px';
    playerContainer.style.top = '-9999px';
    document.body.appendChild(playerContainer);

    // Charger l'API YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialiser le player
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'YRu6NK19VkQ',
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'YRu6NK19VkQ'
        },
      });

      playerRef.current = newPlayer;
      // Certaines plateformes bloquent l'autoplay: tenter un play après un court délai
      setTimeout(() => {
        try { 
          newPlayer.playVideo();
        } catch {}
      }, 800);
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (document.body.contains(playerContainer)) {
        document.body.removeChild(playerContainer);
      }
    };
  }, []);

  // Pas de rendu UI — la musique joue en arrière-plan silencieusement
  return null;
}
