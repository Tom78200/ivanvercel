import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Artwork } from "@shared/schema";
import TranslatedText from "@/components/TranslatedText";

const EMPTY_DETAIL = ['non spécifiée', 'non spécifiées', 's.d.', 'n/a', 'nc', '-'];
function hasDetailValue(v?: string | null): boolean {
  if (v == null) return false;
  const t = v.trim().toLowerCase();
  return t.length > 0 && !EMPTY_DETAIL.includes(t);
}

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkLightbox({ artwork, isOpen, onClose }: ArtworkLightboxProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      setIsImageLoaded(false);
      setCurrentImageIndex(0);
      setTilt({ rotateX: 0, rotateY: 0 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }
  }, [isOpen]);

  const allImages = useMemo(() => (
    artwork ? [artwork.imageUrl, ...(artwork.additionalImages || [])] : []
  ), [artwork]);
  const hasMultipleImages = allImages.length > 1;

  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Gestion de l'inclinaison physique 3D et du reflet en grand format
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleImageMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  // Gestion du swipe tactile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasMultipleImages) {
      goToNext();
    }
    if (isRightSwipe && hasMultipleImages) {
      goToPrevious();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Précharger l'image suivante pour une transition instantanée
  useEffect(() => {
    if (!isOpen || !hasMultipleImages) return;
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    const url = allImages[nextIndex];
    if (!url) return;
    const img = new Image();
    img.decoding = 'async' as any;
    img.src = url;
  }, [isOpen, hasMultipleImages, currentImageIndex, allImages]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          role="dialog" aria-modal="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative w-[96vw] h-[95vh] sm:w-[92vw] sm:h-[90vh] overflow-hidden rounded-2xl bg-black/50 border border-white/10 will-change-transform flex flex-col justify-between"
            onClick={onClose}
            initial={{ scale: 0.88, rotateX: 6, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, rotateX: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.9, rotateX: -4, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-white/20 rounded-full p-2 transition-all duration-300 shadow-md border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Fermer la fenêtre d'aperçu"
            >
              <X className="text-white" size={20} />
            </button>
            
            {/* Zone d'affichage de l'œuvre avec physique 3D et reflet */}
            <div 
              className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
              onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e); }}
              onTouchMove={(e) => { e.stopPropagation(); onTouchMove(e); }}
              onTouchEnd={(e) => { e.stopPropagation(); onTouchEnd(); }}
            >
              <motion.div
                animate={{
                  rotateX: tilt.rotateX,
                  rotateY: tilt.rotateY,
                  scale: glare.opacity ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.7 }}
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full flex items-center justify-center rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] cursor-pointer"
              >
                {/* Reflet dynamique de vernis / lumière qui suit la souris sur la toile agrandie */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: glare.opacity ? 0.35 : 0,
                    background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 80%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.img 
                    key={currentImageIndex}
                    src={allImages[currentImageIndex]} 
                    alt={`${artwork?.title || ""} - Image ${currentImageIndex + 1}`}
                    className="max-h-[72vh] sm:max-h-[76vh] w-auto max-w-full object-contain rounded-xl select-none block transform-gpu will-change-transform"
                    onLoad={() => setIsImageLoaded(true)}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </AnimatePresence>

                {/* Subtile bordure satinée autour de la toile */}
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/10" />
              </motion.div>
              
              {/* Flèches de navigation d'images multiples */}
              {hasMultipleImages && (
                <>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 rounded-full p-2.5 sm:p-3 shadow-md border border-white/20 focus-visible:outline-none cursor-pointer select-none"
                    aria-label="Image précédente"
                  >
                    <span className="text-white text-lg sm:text-xl font-bold">‹</span>
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 rounded-full p-2.5 sm:p-3 shadow-md border border-white/20 focus-visible:outline-none cursor-pointer select-none"
                    aria-label="Image suivante"
                  >
                    <span className="text-white text-lg sm:text-xl font-bold">›</span>
                  </motion.button>
                </>
              )}
            </div>
            
            {/* Panneau d'informations en bas */}
            <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-4 sm:p-6 md:p-8 shrink-0">
              {/* Indicateurs de vignettes pour œuvres multi-vues */}
              {hasMultipleImages && (
                <div className="flex justify-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                  {allImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
                {artwork && (
                  <>
                    <div className="text-white">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-playfair mb-1 sm:mb-2 will-change-transform">
                        <TranslatedText text={artwork.title} />
                      </h3>
                      {[artwork.technique, artwork.dimensions, artwork.year].filter(hasDetailValue).length > 0 && (
                        <p className="text-sm sm:text-base md:text-lg opacity-80 will-change-transform">
                          <TranslatedText text={[artwork.technique, artwork.dimensions, artwork.year].filter(hasDetailValue).join(' • ')} />
                        </p>
                      )}
                    </div>
                    {hasDetailValue(artwork.description) && (
                      <div className="text-right text-sm sm:text-base max-w-md hidden md:block opacity-70 will-change-transform">
                        <p className="line-clamp-2"><TranslatedText text={artwork.description || ''} /></p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
