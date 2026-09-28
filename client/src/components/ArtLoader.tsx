import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtLoader() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    // 1. Verrouiller complètement le défilement et forcer le scroll en haut de page
    window.scrollTo(0, 0);
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code) || [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    // Phase 1 : Révélation majestueuse et contemplation (4.0s)
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, 4000);

    // Phase 2 : Fin complète et libération du scroll et de l'écran (4.7s)
    const finishTimer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    }, 4700);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, []);

  const nameLetters = "IVAN GAUTHIER".split("");

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="art-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } 
          }}
          className="fixed inset-0 z-[10000] bg-[#070709] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden touch-none"
        >
          {/* 1. Texture de tableau accélérée 100% GPU sans filtre CSS lourd pour fluidité absolue (60/120 FPS) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ scale: 1.35, opacity: 0 }}
              animate={{ 
                scale: phase === "enter" ? 1.05 : 1.0, 
                opacity: phase === "enter" ? 0.38 : 0,
                transition: { 
                  scale: { duration: 4.8, ease: "easeOut" },
                  opacity: { duration: phase === "enter" ? 1.2 : 0.7, ease: "easeOut" }
                }
              }}
              style={{
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              className="w-full h-full transform-gpu"
            >
              <img
                src="https://fzyxdcdzhppdxhoiqatz.supabase.co/storage/v1/object/public/Images/images/1784299235030-776322712.jpg"
                alt="Texture de toile"
                className="w-full h-full object-cover transform-gpu pointer-events-none select-none"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>
          </div>

          {/* Voile sombre et vignette feutrée réalisés en dégradé natif (0 coût GPU) */}
          <div 
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(7,7,9,0.55)_0%,rgba(7,7,9,0.92)_70%,#070709_100%)]" 
          />

          {/* Halo d'ambiance galerie subtil en dégradé natif fluide */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase === "enter" ? 0.35 : 0,
              transition: { duration: 2, ease: "easeInOut" }
            }}
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,220,160,0.1)_0%,transparent_60%)]"
          />

          {/* Contenu central : Nom lettre par lettre & Trait de pinceau */}
          <motion.div 
            className="relative z-10 flex flex-col items-center px-4"
            animate={phase === "exit" ? { 
              opacity: 0, 
              y: -14, 
              transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            } : {}}
            style={{
              willChange: "transform, opacity",
            }}
          >
            {/* Titre lettre par lettre : cadence ralentie et transitions 100% GPU */}
            <div className="flex flex-wrap justify-center items-center mb-6 overflow-hidden">
              {nameLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ 
                    y: 35, 
                    opacity: 0, 
                    scale: 1.25,
                  }}
                  animate={{ 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      duration: 0.85,
                      delay: 0.2 + index * 0.11, // Cadence pour ressentir chaque lettre
                      ease: [0.22, 1, 0.36, 1],
                    }
                  }}
                  style={{
                    willChange: "transform, opacity",
                    transform: "translate3d(0,0,0)",
                  }}
                  className={`font-playfair text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-amber-100/75 tracking-[0.3em] uppercase font-light drop-shadow-[0_2px_18px_rgba(255,255,255,0.35)] ${
                    char === " " ? "w-4 sm:w-8" : ""
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Trait de pinceau d'artiste qui se trace sous le nom */}
            <div className="relative w-52 sm:w-80 md:w-96 h-3 flex items-center justify-center my-1">
              <svg 
                viewBox="0 0 320 12" 
                fill="none" 
                className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
              >
                <defs>
                  <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="rgba(245, 230, 200, 0.85)" />
                    <stop offset="65%" stopColor="rgba(255, 255, 255, 0.95)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 10 6 Q 80 3, 160 6 T 310 5"
                  stroke="url(#brushGradient)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    transition: { 
                      pathLength: { delay: 1.7, duration: 1.3, ease: [0.16, 1, 0.3, 1] },
                      opacity: { delay: 1.7, duration: 0.3 }
                    }
                  }}
                />
              </svg>
            </div>

            {/* Sous-titre "Artiste Peintre Contemporain" */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.25em", y: 6 }}
              animate={{ 
                opacity: 0.75, 
                letterSpacing: "0.5em", 
                y: 0,
                transition: { delay: 2.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
              }}
              className="mt-4 text-[10px] xs:text-xs sm:text-sm uppercase text-amber-50/85 font-inter font-light"
            >
              Artiste Peintre Contemporain
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
