import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { Artwork } from "@shared/schema";

interface GalerieRowCardProps {
  artwork: Artwork;
  isSelected: boolean;
  isFirst: boolean;
  delayIndex: number;
  onClick: () => void;
}

export default function GalerieRowCard({
  artwork,
  isSelected,
  isFirst,
  delayIndex,
  onClick,
}: GalerieRowCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Effet d'inclinaison 3D physique au survol
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.button
      ref={cardRef}
      className={`relative inline-block mr-3 sm:mr-4 align-top snap-start rounded-xl focus:outline-none overflow-visible last:mr-3 sm:last:mr-4 md:last:mr-6 cursor-pointer ${
        isFirst ? "sm:ml-1 md:ml-2 lg:ml-3" : ""
      }`}
      style={{
        perspective: 900,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={artwork.title}
      initial={{ 
        opacity: 0, 
        scale: 0.9, 
        filter: "blur(4px)" 
      }}
      whileInView={{ 
        opacity: isSelected ? 1 : 0.88, 
        scale: 1, 
        filter: "blur(0px)",
        transition: { 
          duration: 0.7, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: delayIndex * 0.08
        } 
      }}
      viewport={{ once: true, margin: "-5%" }}
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isSelected ? 1.06 : (isHovered ? 1.05 : 1),
          y: isHovered ? -6 : 0,
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
        className={`relative rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 ${
          isSelected 
            ? "ring-2 ring-white/80 shadow-[0_12px_35px_rgba(255,255,255,0.25)]" 
            : isHovered 
              ? "shadow-[0_20px_45px_rgba(0,0,0,0.85)] border-white/30" 
              : "border-white/10"
        } border bg-black/40`}
      >
        {/* Reflet dynamique de vernis / spot de lumière qui suit la souris */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: glare.opacity ? 0.38 : 0,
            background: `radial-gradient(circle 180px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />

        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-36 sm:h-44 md:h-56 w-auto object-contain rounded-xl block select-none pointer-events-none"
          loading="lazy"
        />

        {/* Effet biseauté de cadre */}
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5" />
      </motion.div>
    </motion.button>
  );
}
