import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useExhibitions } from "@/hooks/use-exhibitions";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslatedText from "@/components/TranslatedText";
import type { Exhibition } from "@shared/schema";

function ExhibitionCard({ exhibition, index }: { exhibition: Exhibition; index: number }) {
  const [, setLocation] = useLocation();
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

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

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
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ delay: index * 0.12, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: 1100 }}
      className="cursor-pointer select-none"
      onClick={() => setLocation(`/expositions/${exhibition.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.025 : 1,
          y: isHovered ? -6 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        className="group relative overflow-hidden rounded-2xl h-80 sm:h-96 border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)] hover:border-white/25"
      >
        {/* Reflet dynamique de vernis / lumière */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity ? 0.35 : 0,
            background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />

        <motion.img 
          src={exhibition.imageUrl} 
          alt={exhibition.title}
          className="w-full h-full object-cover transform-gpu will-change-transform"
          loading="lazy"
          animate={{ scale: isHovered ? 1.08 : 1.02 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Voile sombre pour le contraste du texte */}
        <motion.div
          className="absolute inset-0 bg-[hsl(210,40%,12%)]"
          animate={{ opacity: isHovered ? 0.25 : 0.45 }}
          transition={{ duration: 0.5 }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            className="text-center"
            animate={{ y: isHovered ? -4 : 4, opacity: isHovered ? 1 : 0.88 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-3xl sm:text-5xl font-playfair text-white mb-3 sm:mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              <TranslatedText text={exhibition.title} />
            </h3>
            <p className="text-base sm:text-xl text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <TranslatedText text={exhibition.location} />{exhibition.year ? ` • ${exhibition.year}` : ''}
            </p>
          </motion.div>
        </div>

        {/* Bordure satinée */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10 group-hover:border-white/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}

export default function Expositions() {
  const { data: exhibitions, isLoading } = useExhibitions();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-playfair"
        >
          {t('general.loading')}
        </motion.div>
      </div>
    );
  }

  if (!exhibitions || exhibitions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-playfair mb-4">{t('exhibitions.title')}</h2>
          <p className="text-lg opacity-80">{t('exhibitions.no-exhibitions')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Expositions - Ivan Gauthier</title>
        <meta name="description" content="Retrouvez toutes les expositions passées et à venir d'Ivan Gauthier, artiste contemporain." />
      </Helmet>
      <section className="min-h-screen pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-playfair text-center mb-16"
          >
            Expositions
          </motion.h2>
          
          <div className="space-y-12">
            {exhibitions.map((exhibition, index) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
