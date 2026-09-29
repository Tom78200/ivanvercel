import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useArtworks } from "@/hooks/use-artworks";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import type { Artwork } from "@shared/schema";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
 
import TranslatedText from "@/components/TranslatedText";
import GalleryArtworkCard from "@/components/GalleryArtworkCard";

export default function Gallery() {
  const { data: artworks, isLoading } = useArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const parallaxY = useSpring(rawY, { stiffness: 80, damping: 25, mass: 0.5 });
  const textRawY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);
  const textY = useSpring(textRawY, { stiffness: 90, damping: 22 });
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const sliderArtworks = artworks?.filter(artwork => artwork.showInSlider) || [];

  const openLightbox = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setTimeout(() => setSelectedArtwork(null), 300);
  }, []);

  useEffect(() => {
    if (sliderArtworks.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderArtworks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderArtworks.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-playfair"
        >
          {t('home.loading')}
        </motion.div>
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-playfair mb-4">{t('home.no-artworks')}</h2>
          <p className="text-lg opacity-80">{t('home.no-artworks-desc')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Galerie d'œuvres — Ivan Gauthier, Artiste Peintre Contemporain</title>
        <meta name="description" content="Galerie d'œuvres d'Ivan Gauthier, artiste peintre contemporain. Peinture figurative et expressionniste, expositions, techniques, années." />
        <link rel="canonical" href="https://www.ivangauthier.com/" />
        <meta name="keywords" content="Ivan Gauthier, galerie, œuvres, peintre, peinture contemporaine, art contemporain, Paris, exposition, artiste" />
        <meta property="og:title" content="Galerie d'œuvres — Ivan Gauthier, Artiste Peintre Contemporain" />
        <meta property="og:description" content="Découvrez la galerie d'œuvres d'Ivan Gauthier, artiste peintre contemporain. Peinture figurative et expressionniste." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ivangauthier.com/" />
        <meta property="og:image" content="https://www.ivangauthier.com/generated-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galerie d'œuvres — Ivan Gauthier" />
        <meta name="twitter:description" content="Galerie d'œuvres d'Ivan Gauthier, artiste peintre contemporain." />
        <meta name="twitter:image" content="https://www.ivangauthier.com/generated-icon.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Galerie d'œuvres d'Ivan Gauthier",
            "description": "Galerie d'œuvres d'Ivan Gauthier, artiste peintre contemporain. Peinture figurative et expressionniste.",
            "url": "https://www.ivangauthier.com/",
            "mainEntity": {
              "@type": "Person",
              "name": "Ivan Gauthier",
              "jobTitle": "Artiste Peintre Contemporain"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://www.ivangauthier.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Galerie",
                  "item": "https://www.ivangauthier.com/"
                }
              ]
            }
          }
        `}</script>
      </Helmet>
      <AnimatePresence>
        <section ref={heroRef} className="relative w-full h-screen min-h-[650px] overflow-hidden bg-black">
          {sliderArtworks.length > 0 ? (
            <AnimatePresence mode="wait">
              {sliderArtworks[currentSlideIndex] && (
                <motion.div
                  key={`slider-${currentSlideIndex}-${sliderArtworks[currentSlideIndex]?.id || 'fallback'}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.45, 0, 0.55, 1]
                  }}
                  className="absolute inset-0"
                >
                  <motion.img 
                    src={sliderArtworks[currentSlideIndex]?.imageUrl} 
                    alt={`${sliderArtworks[currentSlideIndex]?.title} - Œuvre d'Ivan Gauthier, artiste peintre contemporain`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width="1920"
                    height="1080"
                    style={{ y: parallaxY }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          )}
          {/* Nom centré mobile */}
          <div className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4">
            <motion.div 
              style={{ y: textY, opacity: textOpacity }}
              className="text-center w-full max-w-sm mx-auto flex flex-col items-center"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-playfair text-white mb-2 tracking-wider uppercase drop-shadow-md">IVAN GAUTHIER</h1>
              <p className="text-xs sm:text-sm text-white/90 tracking-[0.25em] uppercase font-light drop-shadow-sm">Artiste Contemporain</p>
            </motion.div>
          </div>

          {/* Nom centré desktop */}
          <div className="hidden md:flex absolute inset-x-0 bottom-16 lg:bottom-20 z-10 justify-center items-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ y: textY, opacity: textOpacity }}
              transition={{ 
                duration: 0.8,
                delay: 0.5,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair text-white mb-4 tracking-wider">IVAN GAUTHIER</h1>
              <p className="text-lg md:text-xl text-white opacity-80 tracking-[0.3em] uppercase">Artiste Contemporain</p>
            </motion.div>
          </div>

        </section>

        {/* Grille d'œuvres */}
        <section className="bg-black relative py-12 sm:py-16 md:py-20">
          <div className="w-full max-w-[2000px] mx-auto px-3 sm:px-4 md:px-6">
            <MasonryColumns artworks={artworks} isLightboxOpen={isLightboxOpen} onOpen={openLightbox} />
          </div>
        </section>

        <ArtworkLightbox
          artwork={selectedArtwork}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
        />
      </AnimatePresence>
    </>
  );
}

type MasonryProps = {
  artworks: Artwork[];
  onOpen: (artwork: Artwork) => void;
  isLightboxOpen: boolean;
};

function MasonryColumns({ artworks, onOpen, isLightboxOpen }: MasonryProps) {
  const [columns, setColumns] = useState<number>(3);
  const [ratios, setRatios] = useState<number[]>([]);

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setColumns(1);
      else if (w < 768) setColumns(1);
      else if (w < 1024) setColumns(2);
      else if (w < 1280) setColumns(2);
      else setColumns(3);
    };
    const onResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          compute();
          ticking = false;
        });
        ticking = true;
      }
    };
    compute();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const r: number[] = [];
      for (const a of artworks) {
        const ratio = await new Promise<number>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (!img.naturalWidth || !img.naturalHeight) resolve(1);
            else resolve(img.naturalWidth / img.naturalHeight);
          };
          img.onerror = () => resolve(1);
          img.src = a.imageUrl;
        });
        r.push(ratio || 1);
      }
      if (!cancelled) setRatios(r);
    }
    load();
    return () => { cancelled = true; };
  }, [artworks]);

  const cols: Artwork[][] = Array.from({ length: columns }, () => []);
  if (ratios.length === artworks.length) {
    const heights: number[] = Array.from({ length: columns }, () => 0);
    const gapUnit = 1; // proxy for vertical gap
    artworks.forEach((artwork, idx) => {
      const ratio = ratios[idx] || 1; // width/height
      // Proxy for rendered height at fixed column width: 1/ratio
      const estimatedHeight = 1 / (ratio || 1);
      let minIndex = 0;
      for (let i = 1; i < columns; i++) {
        if (heights[i] < heights[minIndex]) minIndex = i;
      }
      cols[minIndex].push(artwork);
      heights[minIndex] += estimatedHeight + gapUnit;
    });
  } else {
    // Fallback round-robin while ratios load
    artworks.forEach((artwork, idx) => {
      cols[idx % columns].push(artwork);
    });
  }

  return (
    <div className="grid gap-4 sm:gap-5 md:gap-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col">
          {col.map((artwork, index) => (
            <GalleryArtworkCard
              key={artwork.id || `c${ci}-art-${index}`}
              artwork={artwork}
              index={ci + index * columns}
              onOpen={onOpen}
              isLightboxOpen={isLightboxOpen}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
