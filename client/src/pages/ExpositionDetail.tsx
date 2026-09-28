import { motion, AnimatePresence } from "framer-motion";
import { useExhibitions } from "@/hooks/use-exhibitions";
import { useLocation } from "wouter";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import TranslatedText from "@/components/TranslatedText";

export default function ExpositionDetail() {
  const { data: exhibitions } = useExhibitions();
  const [, setLocation] = useLocation();
  const exhibitionId = window.location.pathname.split("/").pop();
  const exhibition = exhibitions?.find(expo => expo.id === Number(exhibitionId));
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Faire défiler la page vers le haut au chargement
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  if (!exhibition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-playfair mb-4">Exposition non trouvée</h2>
          <button
            onClick={() => setLocation("/expositions")}
            className="text-white/60 hover:text-white transition-colors"
          >
            Retour aux expositions
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Bouton de retour */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setLocation("/expositions")}
        className="fixed top-20 left-4 md:top-8 md:left-8 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="Retour aux expositions"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </motion.button>

      {/* Bannière */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={exhibition.imageUrl}
            alt={exhibition.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-playfair text-white mb-2">
              <TranslatedText text={exhibition.title} />
            </h1>
            <p className="text-xl text-white/80">
              <TranslatedText text={exhibition.location} />{exhibition.year ? ` • ${exhibition.year}` : ''}
            </p>
            {(exhibition as any).theme && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
                <span className="text-sm text-white/85">{(exhibition as any).theme}</span>
              </div>
            )}
            {exhibition.description && (
              <div className="mt-4 max-w-3xl">
                <p className="text-lg md:text-xl text-white/80 leading-relaxed line-clamp-2 md:line-clamp-3">
                  <TranslatedText text={exhibition.description} />
                </p>
                {exhibition.description.length > 120 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-base text-white/90 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                  >
                    <span>Lire la suite</span>
                    <span>↓</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Galerie d'images */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <ExpositionMasonry images={(exhibition.galleryImages ?? []) as { url: string; caption: string }[]} />
          </motion.div>
        </div>
      </section>

      {/* Ouverture somptueuse du texte avec fond teinté */}
      <AnimatePresence>
        {isExpanded && exhibition.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
            >
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between p-6 md:p-8 pb-4 border-b border-white/10 shrink-0">
                <div className="pr-6">
                  <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium mb-1.5">
                    L'histoire de l'exposition
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-white leading-tight">
                    <TranslatedText text={exhibition.title} />
                  </h2>
                  <p className="text-sm md:text-base text-white/60 mt-1">
                    <TranslatedText text={exhibition.location} />{exhibition.year ? ` • ${exhibition.year}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 -mr-2 -mt-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Texte complet somptueux */}
              <div className="overflow-y-auto p-6 md:p-8 py-6 text-white/90 text-base sm:text-lg md:text-xl font-light leading-relaxed whitespace-pre-line space-y-4">
                <TranslatedText text={exhibition.description} />
              </div>

              {/* Pied de carte */}
              <div className="p-4 md:p-6 pt-3 border-t border-white/10 flex justify-between items-center shrink-0">
                <span className="text-xs text-white/40 italic">Ivan Gauthier</span>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                >
                  <span>Fermer</span>
                  <span>↑</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpositionPhotoCard({ 
  image, 
  onClick 
}: { 
  image: { url: string; caption: string; originalIndex: number }; 
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }}
      viewport={{ once: true, margin: "-10%" }}
      style={{ perspective: 1000 }}
      className="cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -6 : 0,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className="group relative rounded-xl overflow-hidden bg-neutral-950/70 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)] hover:border-white/25"
      >
        {/* Reflet dynamique de vernis / lumière qui suit la souris */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity ? 0.35 : 0,
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />

        <motion.img
          src={image.url}
          alt={image.caption}
          className="w-full h-auto object-cover transform-gpu will-change-transform"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Voile de légende */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white font-medium text-base sm:text-lg drop-shadow-md">
            <TranslatedText text={image.caption} />
          </p>
        </div>

        {/* Bordure satinée */}
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/10 group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

function ExpositionMasonry({ images }: { images: { url: string; caption: string }[] }) {
  const [columns, setColumns] = useState(3);
  const [ratios, setRatios] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [lightboxTilt, setLightboxTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [lightboxGlare, setLightboxGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setLightboxTilt({ rotateX, rotateY });
    setLightboxGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleLightboxMouseLeave = () => {
    setLightboxTilt({ rotateX: 0, rotateY: 0 });
    setLightboxGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev > 0 ? prev - 1 : images.length - 1)));
  };
  const goToNext = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev < images.length - 1 ? prev + 1 : 0)));
  };

  useEffect(() => {
    if (lightboxIndex === null) {
      setLightboxTilt({ rotateX: 0, rotateY: 0 });
      setLightboxGlare({ x: 50, y: 50, opacity: 0 });
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, images.length]);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 768) setColumns(1);
      else if (w < 1280) setColumns(2);
      else setColumns(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const r: number[] = [];
      for (const im of images) {
        const ratio = await new Promise<number>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1);
          img.onerror = () => resolve(1);
          img.src = im.url;
        });
        r.push(ratio || 1);
      }
      if (!cancelled) setRatios(r);
    }
    load();
    return () => { cancelled = true; };
  }, [images]);

  const cols: { url: string; caption: string; originalIndex: number }[][] = Array.from({ length: columns }, () => []);
  if (ratios.length === images.length) {
    const heights = Array.from({ length: columns }, () => 0);
    const gapUnit = 1;
    images.forEach((im, idx) => {
      const ratio = ratios[idx] || 1;
      const estimatedHeight = 1 / ratio;
      let minIndex = 0;
      for (let i = 1; i < columns; i++) if (heights[i] < heights[minIndex]) minIndex = i;
      cols[minIndex].push({ ...im, originalIndex: idx });
      heights[minIndex] += estimatedHeight + gapUnit;
    });
  } else {
    images.forEach((im, idx) => cols[idx % columns].push({ ...im, originalIndex: idx }));
  }

  if (images.length === 0) return <div className="text-white/60 text-center">Aucune image pour cette exposition.</div>;

  return (
    <>
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-8">
            {col.map((image) => (
              <ExpositionPhotoCard
                key={`col-${ci}-${image.originalIndex}`}
                image={image}
                onClick={() => setLightboxIndex(image.originalIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md"
            role="dialog" aria-modal="true"
            onClick={() => setLightboxIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-30 bg-black/60 rounded-full p-2 hover:bg-white/20 transition-all border border-white/20"
              aria-label="Fermer"
            >
              <X className="text-white" size={20} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 rounded-full p-2.5 sm:p-3 border border-white/20 cursor-pointer"
                  aria-label="Image précédente"
                >
                  <span className="text-white text-lg sm:text-xl font-bold">‹</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 rounded-full p-2.5 sm:p-3 border border-white/20 cursor-pointer"
                  aria-label="Image suivante"
                >
                  <span className="text-white text-lg sm:text-xl font-bold">›</span>
                </button>
              </>
            )}
            <motion.div
              className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.88, rotateX: 6, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.9, rotateX: -4, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1200 }}
            >
              <motion.div
                animate={{
                  rotateX: lightboxTilt.rotateX,
                  rotateY: lightboxTilt.rotateY,
                  scale: lightboxGlare.opacity ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.7 }}
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleLightboxMouseMove}
                onMouseLeave={handleLightboxMouseLeave}
                className="relative rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-white/10 cursor-pointer"
              >
                {/* Reflet dynamique de lumière */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: lightboxGlare.opacity ? 0.35 : 0,
                    background: `radial-gradient(circle 350px at ${lightboxGlare.x}% ${lightboxGlare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 80%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                <img
                  src={images[lightboxIndex].url}
                  alt={images[lightboxIndex].caption}
                  className="max-w-full max-h-[76vh] object-contain rounded-2xl block"
                />
              </motion.div>

              {images[lightboxIndex].caption && (
                <p className="text-white text-center mt-4 text-base sm:text-lg font-light drop-shadow-md">
                  <TranslatedText text={images[lightboxIndex].caption} />
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}