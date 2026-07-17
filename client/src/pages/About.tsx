import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Helmet } from "react-helmet-async";
import TranslatedText from "@/components/TranslatedText";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/ivan_gauthier.art/", label: "Instagram", color: "hover:text-pink-400" },
];

type Page = {
  title: string;
  photo: string;
  paragraphs: string[];
};

const pages: Page[] = [
  {
    title: "Introduction & l'éveil artistique",
    photo: "/images/about/portrait.jpg",
    paragraphs: [
      "Ivan Gauthier ? Une rencontre artistique et humaine. Retrouvant dans l'homme toute la sensibilité et la fragilité de ses œuvres, et inversement. Ivan fait partie de ces artistes dont on peut être bien entendu touché directement, simplement par ses œuvres, mais dont la connaissance du parcours, la rencontre avec l'artiste, et l'explication de son intention donnent des clés de lecture et permettent de plus encore d'en apprécier les œuvres. Ivan Gauthier est jeune par son âge, mais surprenant de maturité tant artistique qu'émotionnelle, humaine…",
      "Artiste autodidacte, il porte en lui un bagage personnel et émotionnel puissant dont témoignent autant sa singularité artistique que son tempérament. Vous ne serez donc pas étonné(e) d'apprendre que ces personnages qu'il peint ont tous une part d'autoportrait…",
      "D'origine ukrainienne, orphelin, il y est adopté et arrive en France à l'âge de 3 ans. Il grandit dans la région lilloise, et toute sa dichotomie, son contraste : entre richesse tant culturelle qu'économique du Nord, et les défis sociaux, ouvriers, qui y persistent. Ivan se forge dans un milieu populaire empreint de tristesse et de pauvreté, qui a exacerbé sa sensibilité artistique.",
      "Dès l'enfance, Ivan ressent le besoin impérieux de s'exprimer à travers le dessin, en particulier, mais aussi le théâtre et la musique. « Mon impulsion artistique trouve ses racines dans l'environnement lourd de mon enfance, marquée par des épisodes psychologiquement difficiles. J'avais un profond désir de ne pas ressembler à ce que je voyais autour de moi ». L'Art devient très tôt autant son refuge que son moyen « d'Être ».",
      "Ses parents jouent un rôle déterminant dans son épanouissement artistique. Son père, passionné d'archéologie et d'histoire naturelle, et sa mère, restauratrice d'objets d'art. Ils lui offrent un accès privilégié à la culture, et un soutien inconditionnel dans sa pratique de l'Art, des Arts. Ceci lui permettra de surmonter les moments difficiles, d'accepter l'échec comme une étape vers la réussite, mais aussi l'armera d'une détermination à Vivre, à exister, à Être… Car sa singularité le confronte au rejet des autres, et en particulier de ses pairs. À l'école, ou plus largement du milieu ouvrier où il évolue.",
    ],
  },
  {
    title: "Ivan Gauthier à Paris : entre perdition et découverte",
    photo: "/images/about/photo-2.jpg",
    paragraphs: [
      "Très jeune, Ivan Gauthier comprend que son avenir personnel, et artistique, est ailleurs… et en l'occurrence à Paris. Il s'y rend une première fois à 16 ans, déterminé, pour s'y installer définitivement à 19 ans.",
      "Il s'y nourrit bien entendu de l'effervescence et de la richesse culturelle des expositions, musées, galeries, mais aussi son amour pour des figures emblématiques comme Victor Hugo et Arthur Rimbaud. Il explore également le monde de la mode, de la création, et du théâtre, aux cours au Cours Florent. Insatiable… Il y fait aussi de nombreuses rencontres, qu'elles soient artistiques, professionnelles ou personnelles. Grâce à cela il vend ses premières œuvres et se construit un tissu relationnel qui lui ouvre les portes d'une élite qu'il fréquente. Il organise des dîners chez lui pour y recevoir amateurs d'Art, collectionneurs, et il vend à peu près tout ce qu'il produit.",
      "« Je n'ai pas fait que de belles rencontres… Je m'y suis aussi perdu, égaré, trompé, grisé, et y ai aussi souffert. Surtout dans ma vie personnelle ». Ivan Gauthier est dans une quête perpétuelle d'amour, et de reconnaissance. De sa personnalité, du jeune homme qu'il est, et de l'artiste. Pendant ce temps, et grâce à cette détermination qui le caractérise, et parce que ses œuvres séduisent, touchent, il se fait une place, entre en galeries, et surtout dans des collections privées… avec une volonté de liberté et de sincérité de créer.",
    ],
  },
  {
    title: "Le style, les œuvres d'Ivan Gauthier",
    photo: "/images/about/photo-3.jpg",
    paragraphs: [
      "Le talent d'Ivan Gauthier est le fruit de ce que la vie lui a offert, et aiguisé : sa sensibilité humaine. Son art capture le contraste entre ce qui est offert au regard, et la vérité qu'elle dissimule, qu'il ressent. Telle la mélancolie des visages qu'il peint, et l'éclat des couleurs vives, révélant un paradoxe saisissant. Sa sensibilité exacerbée lui permet de \"voir\" au-delà des apparences. Il ne cherche pas en fait à créer de l'émotion, mais à la faire apparaître. « Je ne suis pas différent des autres même si c'est ce que l'on m'a fait ressentir. Car, tous, nous sommes revêtus d'un paraître plus ou moins prononcé masquant l'Être. Et ce sont bien souvent les personnes les plus malheureuses qui sont les plus chatoyantes ». Raison pour laquelle chacun de ses portraits est imprégné d'une part de lui-même, comme ses sourcils… L'art pour Ivan est un moyen de se rapprocher des autres, dans tous les sens du terme. Un lien, une expérience partagée avec ceux qui observent ses créations. « Plus les gens apprécient mon travail, plus je me sens inspiré, déterminé à peindre ». Pour lui, l'art est une manière de voir et d'être vu, un moyen de communiquer sa vision sensible du monde humain.",
      "L'œuvre d'Ivan Gauthier oscille entre la spontanéité du trait du dessin, brut, impulsif, et une figuration plus étudiée, méticuleuse en peinture sur toile. S'il lui arrive d'explorer le champ des possibles du paysage, de la nature morte, le portrait reste son sujet de prédilection. Mais quelle que soit l'œuvre, le sujet, le support, son style est éminemment reconnaissable, ce qui témoigne d'une puissance et d'une maturité artistique rares pour un si jeune artiste…",
      "Outre le trait, et le style très particulier de ces visages, Ivan se reconnaît à sa palette de peintures. Vive, intense. « Peut-être, probablement même, parce que j'ai peur du noir… mais aussi parce que je suis daltonien ». Pour autant Ivan explore la palette des bleus, et en particulier en s'inspirant du bleu de Prusse et de la nuit étoilée de Kees Van Dongen, qui a été une de ses premières grandes émotions artistiques. Outre les couleurs, les motifs des vêtements relèvent de son goût pour la mode, les tissus, les imprimés. Toujours dans cette intention de créer le contraste entre le vêtement et ce qu'il habille… à commencer par ces regards qu'il sait si bien faire « parler » et en révéler la vérité…",
    ],
  },
  {
    title: "Conclusion : un talent bouillonnant…",
    photo: "/images/about/photo-4.jpg",
    paragraphs: [
      "Ivan Gauthier est un Artiste auquel nous mettons une majuscule sans hésiter. Pour le niveau artistique, le tempérament, la maturité, le parcours. Et pourtant si jeune, et 280 œuvres à son actif qui sont pour la très grande majorité au sein de collections d'amateurs d'Art avertis. Son énergie sert sa détermination et inversement. Avide d'Art, d'émotion, de sensibilité, mais aussi séducteur au sens « dandy » du terme… Ivan Gauthier est un jeune homme très cultivé, doté d'excellentes manières et doué d'une éloquence devenue rare pour sa génération. Ce qui le rend étonnant, surprenant, et pour le moins captivant, à l'image de sa peinture. Bouillonnant ? Par les envies de création qui l'habitent, comme récemment où il a jeté son dévolu sur la photographie, que nous serons bientôt heureux de vous présenter aussi.",
    ],
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateActive = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      sectionRefs.current.forEach((el, index) => {
        if (!el) return;
        const sectionCenter = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
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

      <div className="min-h-screen bg-black pt-20 sm:pt-24 md:pt-28 pb-16">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Citation d'intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center mb-10 sm:mb-14"
          >
            <blockquote className="max-w-2xl text-lg sm:text-xl md:text-2xl font-playfair italic text-white/80 leading-relaxed">
              « Quand vous marchez dans la rue les femmes les plus malheureuses sont les plus décorées… »
            </blockquote>
          </motion.div>

          {/* Indicateur de section (cliquable, suit le scroll) */}
          <div className="hidden md:flex items-center justify-center gap-3 mb-10 sticky top-24 z-10">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === index ? "bg-white" : "bg-white/20 hover:bg-white/40"}`}
                aria-label={`Aller à la section ${index + 1}`}
              />
            ))}
          </div>

          {/* Sections au scroll */}
          <div className="flex flex-col gap-20 sm:gap-28 md:gap-40">
            {pages.map((page, index) => (
              <div
                key={index}
                ref={(el) => { sectionRefs.current[index] = el; }}
                className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-8 md:gap-12 items-start"
              >
                <div className="mx-auto md:mx-0 w-full max-w-xs md:max-w-none md:sticky md:top-40">
                  <motion.div
                    className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={page.photo}
                      alt={`Ivan Gauthier — ${page.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="800"
                    />
                  </motion.div>
                  <p className="text-white/40 text-xs uppercase tracking-widest text-center mt-3">
                    {index + 1} / {pages.length}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-white mb-6">
                    {page.title}
                  </h2>
                  {page.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-base sm:text-lg text-white/75 leading-relaxed mb-4 sm:mb-5">
                      <TranslatedText text={p} />
                    </p>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Réseaux sociaux */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center gap-6 mt-20 sm:mt-24 pt-10 border-t border-white/10"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/60 hover:text-white transition-colors ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-7 h-7" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
