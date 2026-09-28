import { useArtworks } from "@/hooks/use-artworks";
import { ARTWORK_CATEGORIES } from "@shared/categories";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArtworkTranslations } from "@/utils/translations";
import { ChevronRight } from "lucide-react";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import GalerieRowCard from "@/components/GalerieRowCard";
import type { Artwork } from "@shared/schema";

export default function Galerie() {
  const { data: artworks } = useArtworks();
  const data = Array.isArray(artworks) ? artworks : [];
  const scrollersRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const { t } = useLanguage();
  const { translateCategory } = useArtworkTranslations();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Catégories présentes dans les données
  const availableCategories = ARTWORK_CATEGORIES.filter(c => 
    c !== 'Autres' && data.some(a => normalize(a.category) === normalize(c))
  );

  const categoriesToShow = selectedCategory === "all" 
    ? ARTWORK_CATEGORIES.filter(c => c !== 'Autres')
    : [selectedCategory];

  const openLightbox = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setTimeout(() => setSelectedArtwork(null), 300);
  };

  const setScrollerRef = (key: string) => (el: HTMLDivElement | null) => {
    scrollersRef.current[key] = el;
  };

  const [selectedIndexByRow, setSelectedIndexByRow] = useState<Record<string, number>>({});
  const [showMobileHint, setShowMobileHint] = useState<Record<string, boolean>>({});

  const setSelected = (key: string, idx: number) => {
    setSelectedIndexByRow((prev) => ({ ...prev, [key]: idx }));
  };

  const scroll = (key: string, dir: -1 | 1) => {
    const el = scrollersRef.current[key];
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const currentIndex = Math.max(0, Math.min(children.length - 1, (selectedIndexByRow[key] ?? 0)));
    const targetIndex = Math.max(0, Math.min(children.length - 1, currentIndex + dir));
    const child = children[targetIndex] as HTMLElement;
    
    // Calcul plus stable pour le centrage
    const containerWidth = el.clientWidth;
    const childWidth = child.clientWidth;
    const childLeft = child.offsetLeft;
    
    // Centrer l'image dans le conteneur avec un offset minimal
    const targetLeft = Math.max(0, childLeft - (containerWidth - childWidth) / 2);
    
    el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    setSelected(key, targetIndex);
    
    // Masquer l'indicateur mobile après navigation
    setShowMobileHint(prev => ({ ...prev, [key]: false }));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!activeRow) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scroll(activeRow, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scroll(activeRow, -1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeRow, selectedIndexByRow]);

  // Afficher l'indicateur mobile pour les catégories avec plus de 4 images
  useEffect(() => {
    const timer = setTimeout(() => {
      ARTWORK_CATEGORIES.forEach(cat => {
        const list = data.filter(a => normalize(a.category) === normalize(cat));
        if (list.length > 4) {
          setShowMobileHint(prev => ({ ...prev, [cat]: true }));
        }
      });
    }, 2000); // Afficher après 2 secondes

    return () => clearTimeout(timer);
  }, [data]);
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-black text-white pt-16 sm:pt-20 md:pt-28"
    >
      {/* Rideau noir court créant l'effet d'obscurité totale puis allumage des projecteurs de la galerie */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-0 bg-black z-40 pointer-events-none"
      />
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }}
        >
          {t('gallery.title')}
        </motion.h1>

        {/* Filtres de catégories chic avec animation physique layout */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
          {["all", ...availableCategories].map((catKey) => {
            const isActive = selectedCategory === catKey;
            const label = catKey === "all" ? (t('category.all') || "Toutes les œuvres") : translateCategory(catKey);
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className="relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 focus:outline-none cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-black font-semibold" : "text-white/70 hover:text-white"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {data.length === 0 ? (
          <div className="text-white/60">{t('gallery.no-artworks')}</div>
        ) : (
          <motion.div layout className="space-y-8 sm:space-y-10 md:space-y-12">
            {categoriesToShow.map((cat, catIndex) => {
              const list = data.filter(a => normalize(a.category) === normalize(cat));
              if (list.length === 0) return null;
              return (
                <motion.div 
                  key={cat} 
                  className="relative overflow-visible"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      duration: 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: catIndex * 0.2
                    } 
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        duration: 0.6, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: catIndex * 0.2 + 0.3
                      } 
                    }}
                    viewport={{ once: true }}
                  >
                    {translateCategory(cat)}
                  </motion.h2>
                  <div className="relative">
                    <motion.button 
                      aria-label="Défiler à gauche" 
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveRow(cat); 
                        scroll(cat, -1); 
                      }} 
                      className="hidden md:block absolute -left-10 md:-left-14 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full p-2 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          duration: 0.5, 
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: catIndex * 0.2 + 0.5
                        } 
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ‹
                    </motion.button>
                    <div ref={setScrollerRef(cat)} className="relative overflow-x-auto overflow-visible whitespace-nowrap snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent py-2 sm:py-3 pl-0 pr-4 sm:pr-6 md:pr-8" style={{scrollbarWidth:'none', overflowY:'visible'}}>
                      {/* Indicateur mobile pour navigation */}
                      <AnimatePresence>
                        {showMobileHint[cat] && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              x: [20, 0, -10]
                            }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                              ease: "easeInOut"
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 md:hidden"
                          >
                            <div className="bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/30">
                              <ChevronRight className="w-5 h-5 text-white" />
                            </div>
                            <motion.div
                              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: [0, 1, 0], y: [5, 0, -5] }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeInOut"
                              }}
                            >
                              Glissez →
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {list.map((a, idx) => {
                        const isSelected = (selectedIndexByRow[cat] ?? 0) === idx;
                        return (
                          <GalerieRowCard
                            key={a.id}
                            artwork={a}
                            isSelected={isSelected}
                            isFirst={idx === 0}
                            delayIndex={idx}
                            onClick={() => {
                              setActiveRow(cat);
                              setSelected(cat, idx);
                              openLightbox(a);
                              const el = scrollersRef.current[cat];
                              if (el) {
                                const child = (el.children[idx] as HTMLElement) || null;
                                if (child) {
                                  const containerWidth = el.clientWidth;
                                  const childWidth = child.clientWidth;
                                  const childLeft = child.offsetLeft;
                                  const left = Math.max(0, childLeft - (containerWidth - childWidth) / 2);
                                  el.scrollTo({ left, behavior: 'smooth' });
                                }
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                    <motion.button 
                      aria-label="Défiler à droite" 
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveRow(cat); 
                        scroll(cat, 1); 
                      }} 
                      className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full p-2 cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          duration: 0.5, 
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: catIndex * 0.2 + 0.5
                        } 
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ›
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
            {(selectedCategory === 'all' || selectedCategory === 'Autres') && (() => {
              const list = data.filter(a => !ARTWORK_CATEGORIES.some(c => c !== 'Autres' && normalize(a.category) === normalize(c)));
              if (list.length === 0) return null;
              return (
                <motion.div 
                  key="Autres" 
                  className="relative overflow-visible"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      duration: 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: ARTWORK_CATEGORIES.filter(c => c !== 'Autres').length * 0.2
                    } 
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        duration: 0.6, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: ARTWORK_CATEGORIES.filter(c => c !== 'Autres').length * 0.2 + 0.3
                      } 
                    }}
                    viewport={{ once: true }}
                  >
                    {t('gallery.others')}
                  </motion.h2>
                  <div className="relative">
                    <button aria-label="Défiler à gauche" onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveRow('Autres'); 
                      scroll('Autres', -1); 
                    }} className="hidden md:block absolute -left-10 md:-left-14 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full p-2 cursor-pointer">‹</button>
                    <div ref={setScrollerRef('Autres')} className="overflow-x-auto overflow-visible whitespace-nowrap snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent py-2 sm:py-3 pl-0 pr-4 sm:pr-6 md:pr-8" style={{scrollbarWidth:'none', overflowY:'visible'}}>
                      {list.map((a, idx) => {
                        const rowKey = 'Autres';
                        const isSelected = (selectedIndexByRow[rowKey] ?? 0) === idx;
                        return (
                          <GalerieRowCard
                            key={a.id}
                            artwork={a}
                            isSelected={isSelected}
                            isFirst={idx === 0}
                            delayIndex={idx}
                            onClick={() => {
                              setActiveRow(rowKey);
                              setSelected(rowKey, idx);
                              openLightbox(a);
                              const el = scrollersRef.current[rowKey];
                              if (el) {
                                const child = (el.children[idx] as HTMLElement) || null;
                                if (child) {
                                  const containerWidth = el.clientWidth;
                                  const childWidth = child.clientWidth;
                                  const childLeft = child.offsetLeft;
                                  const left = Math.max(0, childLeft - (containerWidth - childWidth) / 2);
                                  el.scrollTo({ left, behavior: 'smooth' });
                                }
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                    <button aria-label="Défiler à droite" onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveRow('Autres'); 
                      scroll('Autres', 1); 
                    }} className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full p-2 cursor-pointer">›</button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </section>
      <ArtworkLightbox
        artwork={selectedArtwork}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </motion.div>
  );
}

function normalize(input?: string | null): string {
  const raw = (input || '').toString().trim();
  if (!raw) return 'Autres';
  return raw
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase();
}


