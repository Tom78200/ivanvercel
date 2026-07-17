import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAutoTranslation } from "@/hooks/useAutoTranslation";

interface Photo {
  url: string;
  position: string;
  size: string;
  caption?: string;
}

interface StepPhotos {
  [key: number]: Photo[];
}

// Tirage aléatoire d'œuvres depuis l'API publique
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function About() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [step, setStep] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orbitArtworks, setOrbitArtworks] = useState<{ url: string; title: string }[]>([]);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Traductions automatiques
  const { translatedText: translatedBirthText } = useAutoTranslation("D'origine ukrainienne, orphelin, il est adopté et arrive en France à l'âge de 3 ans. Il grandit dans la région lilloise, entre richesse culturelle et défis sociaux, dans un milieu populaire qui a exacerbé sa sensibilité artistique. Dès l'enfance, Ivan ressent le besoin impérieux de s'exprimer à travers le dessin, mais aussi le théâtre et la musique.");
  const { translatedText: translatedJourneyTitle } = useAutoTranslation("Mon parcours");
  const { translatedText: translatedJourneyText } = useAutoTranslation("Très jeune, Ivan comprend que son avenir est ailleurs, à Paris. Il s'y rend une première fois à 16 ans, déterminé, pour s'y installer définitivement à 19 ans. Il s'y nourrit de l'effervescence des expositions, des musées, des galeries, explore la mode et le théâtre au Cours Florent, vend ses premières œuvres et se construit un tissu relationnel qui lui ouvre les portes d'une élite qu'il fréquente.");
  const { translatedText: translatedArtTitle } = useAutoTranslation("Mon art");
  const { translatedText: translatedArtText } = useAutoTranslation("L'œuvre d'Ivan Gauthier oscille entre la spontanéité du trait, brut et impulsif, et une figuration plus étudiée en peinture sur toile. Le portrait reste son sujet de prédilection. Sa palette, vive et intense, explore en particulier le bleu de Prusse. Chacun de ses portraits est imprégné d'une part de lui-même, révélant la mélancolie des visages qu'il peint et l'éclat des couleurs vives, dans un paradoxe saisissant.");
  const { translatedText: translatedClickHint } = useAutoTranslation("Cliquez pour découvrir");

  useEffect(() => {
    // Charger des œuvres publiques et en sélectionner aléatoirement 6 pour l'orbite
    fetch('/api/artworks')
      .then(r => r.ok ? r.json() : [])
      .then((list: any[]) => {
        const pool = (list || []).map(a => ({ url: a.imageUrl as string, title: a.title as string })).filter(a => !!a.url);
        const picked = shuffleArray(pool).slice(0, 6);
        if (picked.length > 0) setOrbitArtworks(picked);
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-400" },
  ];

  const stepPhotos: StepPhotos = {
    1: [
      {
        url: "https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg",
        position: "-top-32 -left-24 rotate-[-8deg]",
        size: "w-48 h-64"
      },
      {
        url: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
        position: "top-40 -right-24 rotate-[5deg]",
        size: "w-40 h-56"
      }
    ],
    2: [
      {
        url: "https://images.pexels.com/photos/1916819/pexels-photo-1916819.jpeg",
        position: "-top-20 -left-32 rotate-[-12deg]",
        size: "w-48 h-64",
        caption: "Danse"
      },
      {
        url: "https://images.pexels.com/photos/7577331/pexels-photo-7577331.jpeg",
        position: "top-1/2 -right-28 -translate-y-1/2 rotate-[8deg]",
        size: "w-44 h-60",
        caption: "Théâtre"
      },
      {
        url: "https://images.pexels.com/photos/4348096/pexels-photo-4348096.jpeg",
        position: "bottom-0 -left-36 rotate-[15deg]",
        size: "w-40 h-56",
        caption: "Piano"
      }
    ],
    3: [
      {
        url: "https://images.pexels.com/photos/6330644/pexels-photo-6330644.jpeg",
        position: "-top-20 -left-32 rotate-[-8deg]",
        size: "w-48 h-64",
        caption: "Peinture"
      },
      {
        url: "https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg",
        position: "top-1/2 -right-28 -translate-y-1/2 rotate-[5deg]",
        size: "w-44 h-60",
        caption: "Dessin"
      },
      {
        url: "https://images.pexels.com/photos/3844791/pexels-photo-3844791.jpeg",
        position: "bottom-0 -left-36 rotate-[-10deg]",
        size: "w-48 h-64",
        caption: "Exposition"
      }
    ]
  };

  const steps = [
    {
      question: t('about.bio'),
      hint: translatedClickHint
    },
    {
      title: "Ivan Gauthier",
      subtitle: t('home.subtitle'),
      text: translatedBirthText
    },
    {
      title: translatedJourneyTitle,
      text: translatedJourneyText
    },
    {
      title: translatedArtTitle,
      text: translatedArtText
    }
  ];

  const fullBiography = `
    « Quand vous marchez dans la rue les femmes les plus malheureuses sont les plus décorées… »

    D'origine ukrainienne, orphelin, il est adopté et arrive en France à l'âge de 3 ans. Il grandit dans la région lilloise, entre richesse culturelle et économique du Nord et les défis sociaux, ouvriers, qui y persistent. Ivan se forge dans un milieu populaire empreint de tristesse et de pauvreté, qui a exacerbé sa sensibilité artistique.

    Dès l'enfance, Ivan ressent le besoin impérieux de s'exprimer à travers le dessin, en particulier, mais aussi le théâtre et la musique. Ses parents jouent un rôle déterminant dans son épanouissement artistique : son père, passionné d'archéologie et d'histoire naturelle, et sa mère, restauratrice d'objets d'art, lui offrent un accès privilégié à la culture et un soutien inconditionnel dans sa pratique de l'Art.

    Très jeune, Ivan comprend que son avenir personnel et artistique est ailleurs, à Paris. Il s'y rend une première fois à 16 ans, déterminé, pour s'y installer définitivement à 19 ans. Il s'y nourrit de l'effervescence et de la richesse culturelle des expositions, musées, galeries, explore le monde de la mode et du théâtre au Cours Florent. Il y vend ses premières œuvres et se construit un tissu relationnel qui lui ouvre les portes d'une élite qu'il fréquente, organisant des dîners chez lui pour y recevoir amateurs d'Art et collectionneurs.

    L'œuvre d'Ivan Gauthier oscille entre la spontanéité du trait du dessin, brut, impulsif, et une figuration plus étudiée, méticuleuse en peinture sur toile. S'il lui arrive d'explorer le paysage ou la nature morte, le portrait reste son sujet de prédilection. Sa palette, vive et intense, explore en particulier le bleu de Prusse et la nuit étoilée de Kees Van Dongen, une de ses premières grandes émotions artistiques. Les motifs des vêtements relèvent de son goût pour la mode et les tissus, toujours dans l'intention de créer un contraste entre le vêtement et ce qu'il habille.

    Artiste auquel on met une majuscule sans hésiter, Ivan Gauthier compte déjà 280 œuvres à son actif, pour la très grande majorité au sein de collections d'amateurs d'Art avertis. Avide d'Art, d'émotion et de sensibilité, il est aujourd'hui l'un des jeunes artistes à suivre absolument.
  `;
  const mobileBiography = `
    D'origine ukrainienne, orphelin, Ivan est adopté et arrive en France à l'âge de 3 ans. Il grandit dans la région lilloise, dans un milieu populaire qui exacerbe sa sensibilité artistique. Dès l'enfance, il ressent le besoin de s'exprimer à travers le dessin, le théâtre et la musique.

    Très jeune, il comprend que son avenir est à Paris. Il s'y rend à 16 ans, puis s'y installe définitivement à 19 ans, où il vend ses premières œuvres et se construit un tissu relationnel qui lui ouvre les portes d'une élite qu'il fréquente.

    Son œuvre oscille entre la spontanéité du dessin, brut et impulsif, et une figuration plus étudiée en peinture sur toile. Le portrait reste son sujet de prédilection, avec une palette vive et intense inspirée notamment du bleu de Prusse.

    Avec déjà 280 œuvres à son actif, pour la plupart au sein de collections d'amateurs avertis, Ivan Gauthier est aujourd'hui l'un des jeunes artistes à suivre absolument.
  `;
  const effectiveFullBiography = isMobile ? mobileBiography : fullBiography;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>À propos — Ivan Gauthier, Artiste Peintre Contemporain</title>
        <meta name="description" content="Biographie d'Ivan Gauthier, artiste peintre contemporain. Parcours, esthétique, expositions et univers artistique." />
        <link rel="canonical" href="https://www.ivangauthier.com/about" />
        <meta name="keywords" content="Ivan Gauthier, biographie, artiste peintre, parcours, expositions, art, peinture contemporaine, expressionniste" />
        <meta property="og:title" content="À propos — Ivan Gauthier, Artiste Peintre Contemporain" />
        <meta property="og:description" content="Découvrez le parcours d'Ivan Gauthier, artiste peintre contemporain. Biographie, esthétique et univers artistique." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.ivangauthier.com/about" />
        <meta property="og:image" content="https://www.ivangauthier.com/generated-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="À propos — Ivan Gauthier" />
        <meta name="twitter:description" content="Biographie d'Ivan Gauthier, artiste peintre contemporain." />
        <meta name="twitter:image" content="https://www.ivangauthier.com/generated-icon.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "name": "À propos d'Ivan Gauthier",
            "description": "Biographie d'Ivan Gauthier, artiste peintre contemporain. Parcours, esthétique, expositions et univers artistique.",
            "url": "https://www.ivangauthier.com/about",
            "mainEntity": {
              "@type": "Person",
              "name": "Ivan Gauthier",
              "jobTitle": "Artiste Peintre Contemporain",
              "nationality": "Français"
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
                  "name": "À propos",
                  "item": "https://www.ivangauthier.com/about"
                }
              ]
            }
          }
        `}</script>
      </Helmet>
      <div className="min-h-screen bg-black pt-16 md:pt-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative min-h-[80vh] flex items-center justify-center">
            {/* Animation circulaire des œuvres (retirée localement) */}

            {/* Cube interactif initial */}
            {!isRevealed && (
              <motion.div
                className="relative cursor-pointer"
                onClick={() => setIsRevealed(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-64 h-64 relative transform-gpu preserve-3d animate-float">
                  <motion.div 
                    className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center text-center p-8 shadow-2xl"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <div>
                      <h2 className="text-3xl font-playfair text-white mb-4">{steps[0].question}</h2>
                      <p className="text-white/60 text-sm">{steps[0].hint}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Contenu révélé */}
            <AnimatePresence mode="wait">
              {isRevealed && (
                <div className="w-full">
                  {/* Rideau qui se lève */}
                  <motion.div
                    className="fixed inset-0 bg-black origin-top"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Portrait principal */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="sticky top-20"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        <img
                          src="/images/about/portrait.jpg"
                          alt="Portrait d'Ivan Gauthier, artiste peintre contemporain"
                          className="w-full h-full object-cover"
                          loading="eager"
                          width="600"
                          height="800"
                        />
                      </div>

                      {/* Photos d'ambiance */}
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {["/images/about/photo-2.jpg", "/images/about/photo-3.jpg", "/images/about/photo-4.jpg"].map((src, i) => (
                          <motion.div
                            key={src}
                            className="aspect-square rounded-lg overflow-hidden border border-white/10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                          >
                            <img
                              src={src}
                              alt={`Ivan Gauthier - photo ${i + 2}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Social Links */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-8 flex justify-center gap-6"
                      >
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-white/60 hover:text-white transition-colors ${social.color}`}
                          >
                            <social.icon className="w-6 h-6" />
                          </a>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Contenu textuel et photos d'ambiance */}
                    <div className="relative">
                      {/* Navigation des étapes */}
                      <div className="flex space-x-2 mb-8">
                        {steps.slice(1).map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setStep(index + 1)}
                            className={`w-2 h-2 rounded-full transition-colors ${step === index + 1 ? "bg-white" : "bg-white/20"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                            aria-label={`Aller à l'étape ${index + 1}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>

                      {/* Contenu de l'étape actuelle */}
                      <div className="mb-16">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                          >
                            {step === 0 ? (
                              <div className="text-center">
                                <h2 className="text-4xl font-playfair text-white mb-6">
                                  {steps[0].question}
                                </h2>
                                <p className="text-lg text-white/70">
                                  {steps[0].hint}
                                </p>
                              </div>
                            ) : (
                              <>
                                <h2 className="text-4xl font-playfair text-white mb-6">
                                  {steps[step]?.title}
                                </h2>
                                {steps[step]?.subtitle && (
                                  <h3 className="text-xl text-white/80 mb-6">
                                    {steps[step].subtitle}
                                  </h3>
                                )}
                                {/* Lien œuvres phares retiré */}
                                <p className="text-lg text-white/70 leading-relaxed">
                                  {steps[step]?.text}
                                </p>

                                {step === steps.length - 1 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8"
                                  >
                                    <motion.button
                                      onClick={() => setShowFullBio(true)}
                                      className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40 text-lg font-medium tracking-wide shadow-lg hover:shadow-xl backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                      aria-label="Voir la biographie entière"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      Voir la biographie entière
                                    </motion.button>
                                  </motion.div>
                                )}
                              </>
                            )}

                            <div className="mt-8 flex justify-center">
                              {step > 0 && (
                                <motion.button
                                  onClick={() => setStep(step - 1)}
                                  className="text-white/60 hover:text-white transition-colors mr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                  aria-label="Étape précédente"
                                  whileHover={{ x: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  ← Précédent
                                </motion.button>
                              )}
                              {step < steps.length - 1 && (
                                <motion.button
                                  onClick={handleNext}
                                  className="text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                  aria-label="Étape suivante"
                                  whileHover={{ x: 5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Suivant →
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Bloc photos d'ambiance retiré à la demande (plus aucune image supplémentaire) */}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modal Biographie complète */}
        <AnimatePresence>
          {showFullBio && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center overflow-y-auto"
              onClick={() => setShowFullBio(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-3xl mx-auto p-8 my-12"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setShowFullBio(false)}
                  className="absolute top-0 right-0 p-4 text-white/60 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={24} />
                </motion.button>
                <div className="prose prose-lg prose-invert max-w-none">
                  {effectiveFullBiography.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mb-6 text-lg text-white/80 leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
