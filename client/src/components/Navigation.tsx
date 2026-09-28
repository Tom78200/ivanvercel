import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu } from "react-icons/hi";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: "/", label: t('nav.gallery') },
    { href: "/expositions", label: t('nav.exhibitions') },
    { href: "/about", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
  ];

  return (
    <>
      {/* Header desktop uniquement */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isScrolled ? -100 : 0,
          opacity: isScrolled ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm hidden md:block"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Left Menu */}
            <div className="flex space-x-6 lg:space-x-8 justify-self-start">
              <Link href="/expositions">
                <span className="relative group py-1 cursor-pointer">
                  <span className={`text-white font-playfair text-base lg:text-lg transition-opacity duration-300 ${
                    location === '/expositions' ? 'opacity-100 font-semibold' : 'opacity-80 group-hover:opacity-100'
                  }`}>
                    {t('nav.exhibitions')}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                    location === '/expositions' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </span>
              </Link>
              <Link href="/about">
                <span className="relative group py-1 cursor-pointer">
                  <span className={`text-white font-playfair text-base lg:text-lg transition-opacity duration-300 ${
                    location === '/about' ? 'opacity-100 font-semibold' : 'opacity-80'
                  }`}>
                    {t('nav.about')}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                    location === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </span>
              </Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className="justify-self-center">
              <h1 className="text-white font-playfair text-xl sm:text-2xl lg:text-3xl tracking-[0.2em] uppercase cursor-pointer whitespace-nowrap hover:opacity-75 transition-opacity duration-300">
                Ivan Gauthier
              </h1>
            </Link>

            {/* Right Menu */}
            <div className="flex items-center space-x-6 lg:space-x-8 justify-self-end">
              <Link href="/galerie">
                <span className="relative group py-1 cursor-pointer">
                  <span className={`text-white font-playfair text-base lg:text-lg transition-opacity duration-300 ${
                    location === '/galerie' ? 'opacity-100 font-semibold' : 'opacity-80 group-hover:opacity-100'
                  }`}>
                    {t('nav.gallery')}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                    location === '/galerie' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </span>
              </Link>
              <Link href="/contact">
                <span className="relative group py-1 cursor-pointer">
                  <span className={`text-white font-playfair text-base lg:text-lg transition-opacity duration-300 ${
                    location === '/contact' ? 'opacity-100 font-semibold' : 'opacity-80 group-hover:opacity-100'
                  }`}>
                    {t('nav.contact')}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-white transition-all duration-300 ${
                    location === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </span>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </nav>
      </motion.header>
      {/* Menu hamburger mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/80 px-3 sm:px-4 py-2 sm:py-3">
        <Link href="/">
          <span className="text-white font-playfair text-lg sm:text-xl tracking-[0.2em] uppercase">Ivan Gauthier</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="w-8 h-8 sm:w-10 sm:h-10 flex flex-col items-center justify-center group focus:outline-none bg-black/80 rounded-full z-[100] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
          >
          {/* Hamburger/Cross animé */}
          <motion.span
            animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 sm:w-8 h-0.5 sm:h-1 bg-white rounded mb-1 origin-center transition-all duration-300"
          />
          <motion.span
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 sm:w-8 h-0.5 sm:h-1 bg-white rounded mb-1 origin-center transition-all duration-300"
          />
          <motion.span
            animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 sm:w-8 h-0.5 sm:h-1 bg-white rounded origin-center transition-all duration-300"
          />
          </button>
        </div>
      </div>
      {/* Menu latéral mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-black/80 flex flex-col items-end"
          >
            <nav className="flex flex-col w-full items-center gap-6 sm:gap-8 mt-16 sm:mt-20">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-base sm:text-lg font-playfair tracking-[0.15em] uppercase font-semibold hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Accueil</Link>
              <Link href="/galerie" onClick={() => setMobileMenuOpen(false)} className="text-white text-base sm:text-lg font-playfair tracking-[0.15em] uppercase font-semibold hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{t('nav.gallery')}</Link>
              <Link href="/expositions" onClick={() => setMobileMenuOpen(false)} className="text-white text-base sm:text-lg font-playfair tracking-[0.15em] uppercase font-semibold hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{t('nav.exhibitions')}</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-white text-base sm:text-lg font-playfair tracking-[0.15em] uppercase font-semibold hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{t('nav.about')}</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white text-base sm:text-lg font-playfair tracking-[0.15em] uppercase font-semibold hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{t('nav.contact')}</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
