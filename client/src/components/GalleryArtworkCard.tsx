import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Artwork } from "@shared/schema";
import TranslatedText from "@/components/TranslatedText";

interface GalleryArtworkCardProps {
  artwork: Artwork;
  index: number;
  onOpen: (artwork: Artwork, rect?: DOMRect) => void;
  isLightboxOpen: boolean;
}

export default function GalleryArtworkCard({
  artwork,
  index,
  onOpen,
  isLightboxOpen,
}: GalleryArtworkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "-8% 0px -8% 0px" });

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Effet d'inclinaison physique 3D marqué et réactif (toile accrochée en suspension)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Angle 3D bien perceptible (-10° à +10°)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    // Position du reflet de vernis / lumière d'exposition
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(6px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0.15, y: -20, scale: 0.98, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: (index % 3) * 0.08,
      }}
      style={{
        perspective: 900,
      }}
      className="cursor-pointer select-none mb-4 sm:mb-6"
      onClick={() => onOpen(artwork, cardRef.current?.getBoundingClientRect())}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -8 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 280, 
          damping: 24, 
          mass: 0.8 
        }}
        style={{ 
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className="group relative rounded-xl overflow-hidden bg-neutral-950/70 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)] hover:border-white/25"
      >
        {/* Reflet dynamique de vernis / lumière de spot de galerie */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity ? 0.35 : 0,
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Halo subtil de bordure biseautée */}
        <div className="absolute inset-0 z-10 pointer-events-none rounded-xl border border-white/10 group-hover:border-white/20 transition-colors duration-500" />

        <div className="relative overflow-hidden">
          <motion.img
            src={artwork.imageUrl}
            alt={`${artwork.title} - ${artwork.technique} ${artwork.year} - Œuvre d'Ivan Gauthier`}
            loading="lazy"
            className="w-full h-auto object-cover transform-gpu will-change-transform"
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Voile d'informations en bas avec relief */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 ${
              isLightboxOpen ? "hide-on-mobile" : ""
            }`}
          >
            <h3 className="text-lg sm:text-xl font-playfair mb-1 transition-transform duration-300 group-hover:translate-x-1 drop-shadow-md">
              <TranslatedText text={artwork.title} />
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light transition-transform duration-300 group-hover:translate-x-1">
              <TranslatedText text={`${artwork.technique}`} />
              {artwork.year ? ` • ${artwork.year}` : ""}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
