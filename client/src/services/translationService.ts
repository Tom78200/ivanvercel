// Service de traduction automatique et dictionnaire complet FR -> EN
export class TranslationService {
  private static instance: TranslationService;
  private cache = new Map<string, string>();

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  private dictionaryEn: Record<string, string> = {
  "Aquarelle": "Watercolor",
  "Peinture": "Painting",
  "Peinture acrylique et gouache sur toile": "Acrylic and gouache on canvas",
  "Peinture acrylique et gouache sur papier": "Acrylic and gouache on paper",
  "Peinture acrylique et gouache papier": "Acrylic and gouache on paper",
  "Peinture acrylique et gouache": "Acrylic and gouache",
  "Technique mixte": "Mixed media",
  "Technique mixte sur papier": "Mixed media on paper",
  "Technique mixte sur papier : aquarelle et encre de Chine": "Mixed media on paper: watercolor and India ink",
  "Abstraction": "Abstract",
  "Abstrait": "Abstract",
  "Portrait": "Portrait",
  "Paysage": "Landscape",
  "Nature morte": "Still Life",
  "Figuratif": "Figurative",
  "Expressionnisme": "Expressionism",
  "Scène de vie": "Scene of Life",
  "Marin": "Seascape",
  "Animalier": "Animal",
  "Nu": "Nude",
  "Impressionnisme": "Impressionism",
  "Surréalisme": "Surrealism",
  "Cubisme": "Cubism",
  "Minimalisme": "Minimalism",
  "Symbolisme": "Symbolism",
  "Réaliste": "Realist",
  "Post‑impressionnisme": "Post-Impressionism",
  "Baroque": "Baroque",
  "Renaissance": "Renaissance",
  "Fauvisme": "Fauvism",
  "Art brut": "Outsider Art",
  "Street art": "Street Art",
  "Pop art": "Pop Art",
  "Art naïf": "Naïve Art",
  "Art déco": "Art Deco",
  "Art nouveau": "Art Nouveau",
  "Calligraphie": "Calligraphy",
  "Paysage urbain": "Urban Landscape",
  "Paysage marin": "Seascape",
  "Nature abstraite": "Abstract Nature",
  "Portrait abstrait": "Abstract Portrait",
  "Autres": "Others",
  "Urbain": "Urban",
  "Déclaration d'amour": "Declaration of Love",
  "Le divan d'un théâtre": "The Theater Sofa",
  "Petit ange amoureux": "Little Angel in Love",
  "Petit danseur fatigué": "Tired Little Dancer",
  "Petit danseur fatigué (mise en situation)": "Tired Little Dancer (In situation)",
  "Un amour secret": "A Secret Love",
  "Un amour vrai": "A True Love",
  "Une danseuse de nuit": "A Night Dancer",
  "Ange tenant l’amour": "Angel Holding Love",
  "Ange tenant l’amour (mise en situation)": "Angel Holding Love (In situation)",
  "Danseuse à l’enfant": "Dancer with Child",
  "Madame sur fond vert": "Lady on Green Background",
  "Un amour passionnel": "A Passionate Love",
  "Un au revoir": "A Farewell",
  "Une campagne de guerre": "A War Campaign",
  "Arbre": "Tree",
  "Un silence de mort": "A Dead Silence",
  "Monsieur nez jaune": "Gentleman with Yellow Nose",
  "Garçon nez jaune": "Boy with Yellow Nose",
  "Gitane": "Gypsy",
  "Les amants des étoiles": "Star Lovers",
  "Un abandon de minuit": "A Midnight Abandon",
  "Un baiser volé": "A Stolen Kiss",
  "Une dernière question": "One Last Question",
  "Garçon cheveux jaunes sur fond rouge": "Yellow-Haired Boy on Red Background",
  "Monsieur au chapeau": "Gentleman with a Hat",
  "Danse de nuit": "Night Dance",
  "Portrait de famille": "Family Portrait",
  "Madame sur papier peint rose": "Lady on Pink Wallpaper",
  "Madame en rose": "Lady in Pink",
  "Le garçon opéra": "The Opera Boy",
  "La gitane au foulard bleu": "The Gypsy in the Blue Scarf",
  "La gitane au foulard bleu (mise en situation)": "The Gypsy in the Blue Scarf (In situation)",
  "Un amour dans la nuit": "A Love in the Night",
  "Un garçon dans la ville": "A Boy in the City",
  "Amour à la mer": "Love by the Sea",
  "Un nuage noir": "A Black Cloud",
  "Madame soleil": "Lady Sun",
  "Portrait d’enfant": "Child Portrait",
  "L’arbre à l’œil": "The Tree with the Eye",
  "Madame au nez jaune": "Lady with Yellow Nose",
  "Un dernier baiser": "One Last Kiss",
  "Frère et sœur": "Brother and Sister",
  "Petit garçon aux étoiles": "Little Boy with the Stars",
  "Un instant d’amour": "A Moment of Love",
  "Un regard magnétique, un foulard rouge éclatant, des bijoux aux mille détails : cette figure captive dès le premier instant. Derrière elle, montagnes et lac nocturne ouvrent les portes d’un ailleurs rêvé.": "A magnetic gaze, a vivid red scarf, richly detailed jewelry: this figure captivates from the very first moment. Behind her, mountains and a nocturnal lake open the doors to a dreamlike elsewhere.",
  "Deux amants en apesanteur se rejoignent dans l’immensité d’un ciel bleu profond. Leurs vêtements fleuris illuminent cette danse céleste, invitation à rêver un amour sans pesanteur.": "Two weightless lovers meet in the vastness of a deep blue sky. Their floral garments illuminate this celestial dance, an invitation to dream of love without gravity.",
  "Un violoniste flotte sous les étoiles pour offrir une sérénade à sa bien-aimée. Couleurs vibrantes et balcon féerique composent une déclaration où l’amour rend tout possible.": "A violinist floats beneath the stars to serenade his beloved. Vibrant colors and an enchanting balcony compose a declaration where love makes all things possible.",
  "Sur un divan rose, deux êtres se rapprochent dans un geste de tendresse chargé de mélancolie. L’éclat des costumes et l’intensité des regards donnent à cette scène intime toute la force du théâtre.": "On a pink sofa, two souls draw together in a tender gesture imbued with melancholy. The brilliance of costumes and intensity of gazes lend this intimate scene the full power of theater.",
  "Les yeux clos, deux êtres s’abandonnent à une étreinte au milieu des étoiles. Le rose flamboyant rencontre le bleu de la nuit dans une vision tendre, comme un rêve que l’on voudrait garder.": "Eyes closed, two souls surrender to an embrace amid the stars. Flamboyant pink meets nocturnal blue in a tender vision, like a dream one wishes to hold forever.",
  "Une main posée sur le front, une tête contre l’épaule : derrière l’éclat des costumes se révèle la douceur du réconfort. Un double portrait touchant, où la fragilité devient grâce.": "A hand resting on the forehead, a head against a shoulder: behind the shimmer of costumes emerges the sweetness of solace. A touching double portrait where fragility turns into grace.",
  "Au cœur d’un bleu nocturne, une figure en serre une autre contre elle, entre inquiétude et protection. Les regards bouleversants donnent à cette étreinte une présence qui retient longtemps.": "At the heart of a nocturnal blue, one figure holds another close, balancing concern and protection. Soul-stirring gazes give this embrace an enduring presence.",
  "Une caresse sur la joue, des visages rapprochés, un sentiment qui se murmure. Turquoise, rouge et orange enveloppent cette complicité d’une richesse de motifs à découvrir du regard.": "A caress on the cheek, faces drawn close, a whispered feeling. Turquoise, red, and orange wrap this intimacy in a wealth of patterns waiting to be discovered.",
  "Deux visages réunis dans une étreinte, baignés d’orange lumineux devant un paysage étoilé. Un portrait chaleureux qui célèbre le bonheur simple et précieux d’être aimé.": "Two faces reunited in an embrace, bathed in luminous orange against a starry landscape. A warm portrait celebrating the simple, precious joy of being loved.",
  "Un baiser se glisse sur une joue dans un foisonnement de plumes, de couleurs et de motifs. Cette scène au charme théâtral saisit l’élan d’un geste tendre et l’émotion de l’instant.": "A kiss brushes against a cheek amidst a flurry of feathers, colors, and patterns. This theatrically charming scene captures the impulse of a tender gesture and the emotion of the moment.",
  "Les mains rouges posées sur le cœur, une danseuse rêve dans un écrin rose et bleu. Son regard songeur et sa robe semée de soleils révèlent une présence aussi douce que captivante.": "Red hands resting over her heart, a dancer dreams in a rose and blue setting. Her pensive gaze and sun-dappled dress reveal a presence as gentle as it is captivating.",
  "Deux visages proches, des regards qui s’évitent : une histoire semble suspendue à quelques mots. Les jaunes lumineux et les roses profonds font vibrer ce portrait habité par les non-dits.": "Two close faces, averting their gazes: a story seems suspended upon a few words. Luminous yellows and deep pinks animate this portrait haunted by the unsaid.",
  "Sous un grand chapeau jaune, deux visages se rapprochent dans une caresse. Plumes flamboyantes et regards lumineux donnent à cette scène un charme théâtral.": "Under a wide yellow hat, two faces draw close in a caress. Flamboyant feathers and radiant gazes lend this scene theatrical charm.",
  "Trois figures se serrent dans un dernier moment de proximité. Les bleus profonds et les rouges intenses font résonner toute l’émotion d’une séparation.": "Three figures huddle together in one last moment of closeness. Deep blues and intense reds resonate with all the emotion of a parting.",
  "Un ange aux cheveux d’or veille sur un visage aux yeux clos. Entre bleu profond et jaune lumineux, cette étreinte célèbre la douceur d’un amour protecteur.": "A golden-haired angel watches over a face with closed eyes. Between deep blue and luminous yellow, this embrace celebrates the sweetness of protective love.",
  "Parée de plumes majestueuses, une danseuse pose auprès d’un enfant. Couleurs éclatantes et costumes foisonnants donnent à ce duo une présence féerique.": "Adorned with majestic feathers, a dancer poses beside a child. Brilliant colors and lavish costumes give this duo a magical presence.",
  "Sur un rouge intense, une chevelure dorée illumine un visage au regard songeur. Les touches libres révèlent un portrait vibrant, entre audace et sensibilité.": "On an intense red, golden hair illuminates a face with a pensive gaze. Free strokes reveal a vibrant portrait, balancing boldness and sensitivity.",
  "Un regard violet, des lèvres écarlates et un col délicatement fleuri composent une élégance singulière. Un visage doux dont la présence retient le regard.": "Violet eyes, scarlet lips, and a delicately flowered collar compose a singular elegance. A gentle face whose presence captivates the gaze.",
  "Deux visages se frôlent sur un rouge ardent, unis par une caresse et un regard. Une composition vibrante qui saisit le trouble de l’instant avant le baiser.": "Two faces graze each other on burning red, united by a caress and a gaze. A vibrant composition capturing the emotion of the moment before a kiss.",
  "Sous la lune d’or, les oiseaux donnent le rythme aux vagues bleues. La nuit danse, et les montagnes rouges retiennent leur souffle.": "Under the golden moon, birds set the rhythm to the blue waves. The night dances, and the red mountains hold their breath.",
  "Une demeure veille derrière les herbes sombres, ses fenêtres pleines de silence. La pluie semble porter la mémoire de ceux qui sont partis.": "A dwelling stands guard behind dark grass, its windows full of silence. The rain seems to carry the memory of those who have departed.",
  "Deux êtres se blottissent au bord d’une mer de songes. Autour d’eux, les collines roses ondulent et les oiseaux emportent la nuit.": "Two souls huddle by the edge of a sea of dreams. Around them, pink hills ripple and birds carry away the night.",
  "L’écorce garde les blessures du temps, les branches cherchent encore le ciel. Dans le bleu, cet arbre nu déploie sa force de vivant.": "The bark bears the scars of time, the branches still reach for the sky. In the blue, this bare tree unfolds its vital strength.",
  "Sous un ciel tourmenté, les toits s’accrochent à la nuit. Des éclats blancs traversent l’ombre, comme des mots emportés par le vent.": "Under a stormy sky, rooftops cling to the night. White bursts pierce the shadows, like words carried away by the wind.",
  "Les voiles noires glissent au pied des montagnes d’ocre. Seuls les oiseaux traversent encore ce silence que la lune éclaire sans le troubler.": "Black sails glide at the foot of ochre mountains. Only birds still cross this silence that the moon illuminates without disturbing.",
  "Une tête contre une épaule, deux regards unis dans un bleu profond. Un portrait tendre où se retrouve la promesse silencieuse de veiller l’un sur l’autre.": "A head against a shoulder, two gazes united in deep blue. A tender portrait embodying the silent promise to watch over each other.",
  "Un nez jaune éclatant et des lèvres bleues donnent à ce visage une énergie saisissante. Un portrait audacieux, porté par la liberté du trait.": "A bright yellow nose and blue lips lend this face a striking energy. A bold portrait driven by freedom of line.",
  "Un éclair jaune traverse un visage bleu profond, ponctué de lèvres rouges. Les contrastes francs donnent à ce portrait une force graphique immédiate.": "A flash of yellow streaks across a deep blue face, punctuated by red lips. Bold contrasts give this portrait immediate graphic power.",
  "Un arbre au regard mystérieux veille sur un personnage bleu à la collerette flamboyante. Un univers de conte où chaque détail invite à imaginer une histoire.": "A tree with a mysterious gaze watches over a blue character with a flaming ruff. A fairytale realm where every detail invites the imagination.",
  "La joue posée dans sa main, une femme au foulard bleu laisse son regard s’évader. Bijoux colorés et étoffes à motifs habillent cette rêverie d’une élégance précieuse.": "With cheek resting in her hand, a woman in a blue scarf lets her gaze drift away. Colorful jewelry and patterned fabrics adorn this reverie with precious elegance.",
  "Un grand nœud sombre et un costume rouge accompagnent le regard rêveur d’un jeune personnage. Un portrait raffiné, dans un décor foisonnant aux accents de spectacle.": "A large dark bow and a red suit accompany the dreamy gaze of a young character. A refined portrait set against an ornate backdrop with theatrical flair.",
  "Rose intense, jaune lumineux et chevelure bleu nuit composent un visage au regard captivant. Une présence affirmée qui fait vibrer la couleur.": "Vivid pink, luminous yellow, and midnight-blue hair compose a face with a captivating gaze. An assertive presence that makes color sing.",
  "Sur un rose vibrant, le visage se révèle par touches libres et traits noirs. Un portrait à la beauté singulière, entre délicatesse et énergie brute.": "On a vibrant pink, the face emerges through free brushwork and black strokes. A portrait of singular beauty, balancing delicacy and raw energy.",
  "Sur un jaune solaire, un visage rêveur émerge d’un vêtement sombre aux motifs délicats. Une rencontre lumineuse entre élégance et mélancolie.": "On a solar yellow, a dreamy face emerges from dark clothing with delicate patterns. A luminous encounter between elegance and melancholy.",
  "Des boucles bleues, de grands yeux et des touches de couleur spontanées composent un portrait sensible. Un regard d’enfance qui interpelle et attendrit.": "Blue curls, wide eyes, and spontaneous touches of color compose a sensitive portrait. A gaze of childhood that touches and moves the heart.",
  "Trois visages se blottissent dans une composition vibrante de bleu, de rose et d’orange. Une évocation expressive des liens qui nous unissent.": "Three faces huddle in a vibrant composition of blue, pink, and orange. An expressive evocation of the bonds that unite us.",
  "Dans l’obscurité, deux êtres se serrent et deviennent leur propre lumière. Le turquoise et l’orange font vibrer cette étreinte, refuge tendre au cœur de la nuit.": "In the darkness, two souls hold each other close and become their own light. Turquoise and orange animate this embrace, a tender refuge in the night.",
  "Un visage songeur, encadré de rouge, se détache sur un bleu lumineux. L’orange du vêtement réchauffe ce portrait empreint d’une douce nostalgie.": "A pensive face framed in red stands out against luminous blue. The orange of the garment warms this portrait imbued with gentle nostalgia.",
  "Le col bleu relevé, un garçon tourne son regard vers nous tandis que la ville s’esquisse derrière lui. Une rencontre fugitive dont la poésie demeure.": "With upturned blue collar, a boy turns his gaze toward us as the city is sketched behind him. A fleeting encounter whose poetry endures.",
  "Une joue se blottit, une main se pose, et le monde tient dans cette proximité. Rouges ardents et fond doré donnent à cet instant la chaleur d’un souvenir précieux.": "A cheek nestles, a hand rests, and the world fits within this closeness. Fiery reds and a golden background give this moment the warmth of a treasured memory.",
  "Sous un chapeau ornementé, une élégante se détache sur un fond rose à motifs. Boucles graphiques et col vert éclatant lui donnent un charme théâtral.": "Beneath an ornate hat, an elegant woman stands out against a patterned pink background. Graphic curls and a striking green collar lend her theatrical charm.",
  "Sous une chevelure lumineuse, de grands yeux bleus semblent garder les secrets du ciel. Un portrait où l’enfance veille encore, entourée de lune et d’étoiles.": "Beneath glowing hair, wide blue eyes seem to hold the secrets of the sky. A portrait where childhood still watches, encircled by moon and stars.",
  "Lire la suite": "Read more",
  "Fermer": "Close",
  "Retour aux expositions": "Back to exhibitions",
  "Exposition non trouvée": "Exhibition not found",
  "Glissez →": "Swipe →",
  "Artexpo New York": "Artexpo New York",
  "Foire d'automne Paris": "Autumn Fair Paris",
  "New York / Paris": "New York / Paris",
  "Paris": "Paris",
  "En 2024, j’ai présenté mon univers à Artexpo New York. De Paris à Manhattan, mes portraits aux couleurs intenses et mes silhouettes de mode ont traversé l’Atlantique pour rencontrer de nouveaux regards. Sur mon stand, les bleus profonds, les roses éclatants et les visages songeurs composaient un monde à la fois intime et théâtral. Cette exposition m’a permis de vendre mes œuvres à des collectionneurs et à des dirigeants d’entreprise new-yorkais. Au cours de ce séjour, j’ai également eu l’occasion de rencontrer le maire de New York. Une collectionneuse sensible à mon travail m’a accueilli dans un logement sublime. Cette hospitalité a donné au voyage une dimension plus personnelle : le plaisir de vivre dans un cadre raffiné, de découvrir la ville à pied et de garder du temps pour peindre. Entre l’effervescence de la foire et le calme des heures de création, ce séjour a réuni ce que j’aime profondément : l’art, les rencontres et la beauté des lieux. Un chapitre new-yorkais où ma peinture a trouvé de nouvelles maisons, tandis que mon regard s’ouvrait à d’autres horizons.": "In 2024, I presented my universe at Artexpo New York. From Paris to Manhattan, my intensely colored portraits and fashion silhouettes crossed the Atlantic to meet new gazes. On my booth, deep blues, radiant pinks, and pensive faces composed a world both intimate and theatrical. This exhibition allowed me to sell my works to collectors and New York business leaders. During this stay, I also had the opportunity to meet the Mayor of New York. A collector sensitive to my work welcomed me into a sublime home. This hospitality gave the journey a more personal dimension: the pleasure of living in refined surroundings, discovering the city on foot, and reserving time to paint. Between the bustle of the fair and the calm of creative hours, this stay brought together what I deeply love: art, encounters, and the beauty of places. A New York chapter where my painting found new homes, while my vision opened to other horizons.",
  "Paris occupe une place particulière dans mon parcours : c’est la ville où je me suis installé à dix-sept ans, avec le désir de donner une vie à mon art. Y présenter mon travail lors de la foire d’automne, c’était inscrire mes couleurs et mes personnages dans cette histoire personnelle.\n\nDans une capitale où la peinture côtoie la couture, le théâtre et la littérature, mon univers trouve des résonances naturelles.\n\nLes étoffes dessinées, les regards songeurs et les gestes tendres composent une peinture où l’élégance se mêle à l’émotion. Exposé à cette occasion, « Ange tenant l’amour » en porte toute la douceur : un visage veille sur un autre, dans un accord de jaune lumineux et de bleu profond. La présence de mon œuvre « Une dernière pensée » dans le catalogue prolonge cette exposition au fil des pages. Une autre manière de laisser une trace, de permettre à un regard de revenir vers un tableau après l’avoir découvert. Ce rendez-vous parisien raconte ainsi mon attachement à une ville où j’ai choisi de devenir artiste. Paris, ses lumières, son mouvement, son goût du beau : un décor vivant dans lequel je poursuis une recherche très intime, celle de donner un visage à ce que l’on ressent.": "Paris holds a special place in my journey: it is the city where I settled at seventeen, with the desire to bring my art to life. Presenting my work at the Autumn Fair was to inscribe my colors and my characters into this personal story.\n\nIn a capital where painting meets couture, theater, and literature, my universe finds natural resonances.\n\nThe designed fabrics, pensive gazes, and tender gestures compose a painting where elegance blends with emotion. Exhibited on this occasion, \"Angel Holding Love\" carries all of its sweetness: one face watches over another, in a harmony of luminous yellow and deep blue. The presence of my work \"A Last Thought\" in the catalog extends this exhibition across the pages. Another way to leave a mark, to allow a gaze to return to a painting after discovering it. This Parisian meeting thus recounts my attachment to a city where I chose to become an artist. Paris, its lights, its movement, its taste for beauty: a living backdrop against which I pursue a very intimate quest, that of giving a face to what we feel."
};

  async translateText(text: string, targetLang: "fr" | "en"): Promise<string> {
    if (!text || typeof text !== "string" || text.trim() === "") return text;

    if (targetLang === "fr") return text;

    const cacheKey = `${text}-${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const clean = text.trim();
    if (this.dictionaryEn[clean]) {
      const translated = this.dictionaryEn[clean];
      this.cache.set(cacheKey, translated);
      return translated;
    }

    // Si la chaîne contient des séparateurs bullet " • " (ex: "Aquarelle • 24x30 cm • 2024")
    if (text.includes(" • ")) {
      const parts = text.split(" • ");
      const translatedParts = parts.map(part => this.dictionaryEn[part.trim()] || part);
      const result = translatedParts.join(" • ");
      this.cache.set(cacheKey, result);
      return result;
    }

    // Remplacement insensible aux apostrophes typographiques (’ vs ')
    const normalizedText = clean.replace(/’/g, "'");
    for (const [key, val] of Object.entries(this.dictionaryEn)) {
      if (key.replace(/’/g, "'") === normalizedText) {
        this.cache.set(cacheKey, val);
        return val;
      }
    }

    this.cache.set(cacheKey, text);
    return text;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const translationService = TranslationService.getInstance();
