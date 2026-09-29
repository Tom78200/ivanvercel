const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// Data extracted directly from the user's reference PDF (media_1790241593459.pdf)
const pdfArtworks = [
  // Page 1: Les aquarelles
  {
    title: "Déclaration d'amour",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "43 x 30 cm",
    description: "Un violoniste flotte sous les étoiles pour offrir une sérénade à sa bien-aimée. Couleurs vibrantes et balcon féerique composent une déclaration où l’amour rend tout possible.",
    year: ""
  },
  {
    title: "Gitane",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Un regard magnétique, un foulard rouge éclatant, des bijoux aux mille détails : cette figure captive dès le premier instant. Derrière elle, montagnes et lac nocturne ouvrent les portes d’un ailleurs rêvé.",
    year: ""
  },
  {
    title: "Le divan d'un théâtre",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Sur un divan rose, deux êtres se rapprochent dans un geste de tendresse chargé de mélancolie. L’éclat des costumes et l’intensité des regards donnent à cette scène intime toute la force du théâtre.",
    year: ""
  },
  {
    title: "Les amants des étoiles",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Deux amants en apesanteur se rejoignent dans l’immensité d’un ciel bleu profond. Leurs vêtements fleuris illuminent cette danse céleste, invitation à rêver un amour sans pesanteur.",
    year: ""
  },
  {
    title: "Petit ange amoureux",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Les yeux clos, deux êtres s’abandonnent à une étreinte au milieu des étoiles. Le rose flamboyant rencontre le bleu de la nuit dans une vision tendre, comme un rêve que l’on voudrait garder.",
    year: ""
  },
  {
    title: "Petit danseur fatigué",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Une main posée sur le front, une tête contre l’épaule : derrière l’éclat des costumes se révèle la douceur du réconfort. Un double portrait touchant, où la fragilité devient grâce.",
    year: ""
  },
  {
    title: "Petit danseur fatigué (mise en situation)",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Une main posée sur le front, une tête contre l’épaule : derrière l’éclat des costumes se révèle la douceur du réconfort. Un double portrait touchant, où la fragilité devient grâce.",
    year: ""
  },
  {
    title: "Un abandon de minuit",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Au cœur d’un bleu nocturne, une figure en serre une autre contre elle, entre inquiétude et protection. Les regards bouleversants donnent à cette étreinte une présence qui retient longtemps.",
    year: ""
  },
  {
    title: "Un amour secret",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Une caresse sur la joue, des visages rapprochés, un sentiment qui se murmure. Turquoise, rouge et orange enveloppent cette complicité d’une richesse de motifs à découvrir du regard.",
    year: ""
  },
  {
    title: "Un amour vrai",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Deux visages réunis dans une étreinte, baignés d’orange lumineux devant un paysage étoilé. Un portrait chaleureux qui célèbre le bonheur simple et précieux d’être aimé.",
    year: ""
  },
  {
    title: "Un baiser volé",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "21 x 18 cm",
    description: "Un baiser se glisse sur une joue dans un foisonnement de plumes, de couleurs et de motifs. Cette scène au charme théâtral saisit l’élan d’un geste tendre et l’émotion de l’instant.",
    year: ""
  },
  {
    title: "Une danseuse de nuit",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "30 x 25 cm",
    description: "Les mains rouges posées sur le cœur, une danseuse rêve dans un écrin rose et bleu. Son regard songeur et sa robe semée de soleils révèlent une présence aussi douce que captivante.",
    year: ""
  },
  {
    title: "Une dernière question",
    category: "Aquarelle",
    technique: "Aquarelle",
    dimensions: "61 x 46 cm",
    description: "Deux visages proches, des regards qui s’évitent : une histoire semble suspendue à quelques mots. Les jaunes lumineux et les roses profonds font vibrer ce portrait habité par les non-dits.",
    year: ""
  },

  // Page 2 & 3: Technique mixte sur papier
  {
    title: "Madame soleil",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier. Sur un jaune solaire, un visage rêveur émerge d’un vêtement sombre aux motifs délicats. Une rencontre lumineuse entre élégance et mélancolie.",
    year: ""
  },
  {
    title: "Portrait d’enfant",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "130 x 100 cm",
    description: "Technique mixte sur papier. Des boucles bleues, de grands yeux et des touches de couleur spontanées composent un portrait sensible. Un regard d’enfance qui interpelle et attendrit.",
    year: ""
  },
  {
    title: "Portrait de famille",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "130 x 100 cm",
    description: "Technique mixte sur papier. Trois visages se blottissent dans une composition vibrante de bleu, de rose et d’orange. Une évocation expressive des liens qui nous unissent.",
    year: ""
  },
  {
    title: "L’arbre à l’œil",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier. Un arbre au regard mystérieux veille sur un personnage bleu à la collerette flamboyante. Un univers de conte où chaque détail invite à imaginer une histoire.",
    year: ""
  },
  {
    title: "Monsieur nez jaune",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "110 x 65 cm",
    description: "Technique mixte sur papier. Un nez jaune éclatant et des lèvres bleues donnent à ce visage une énergie saisissante. Un portrait audacieux, porté par la liberté du trait.",
    year: ""
  },
  {
    title: "Madame au nez jaune",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "110 x 65 cm",
    description: "Technique mixte sur papier. Rose intense, jaune lumineux et chevelure bleu nuit composent un visage au regard captivant. Une présence affirmée qui fait vibrer la couleur.",
    year: ""
  },
  {
    title: "Madame sur papier peint rose",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "130 x 100 cm",
    description: "Technique mixte sur papier. Sous un chapeau ornementé, une élégante se détache sur un fond rose à motifs. Boucles graphiques et col vert éclatant lui donnent un charme théâtral.",
    year: ""
  },
  {
    title: "Madame en rose",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "130 x 100 cm",
    description: "Technique mixte sur papier. Sur un rose vibrant, le visage se révèle par touches libres et traits noirs. Un portrait à la beauté singulière, entre délicatesse et énergie brute.",
    year: ""
  },
  {
    title: "Un dernier baiser",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "8 x 6 cm",
    description: "Technique mixte sur papier. Un visage songeur, encadré de rouge, se détache sur un bleu lumineux. L’orange du vêtement réchauffe ce portrait empreint d’une douce nostalgie.",
    year: ""
  },
  {
    title: "Le garçon opéra",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier. Un grand nœud sombre et un costume rouge accompagnent le regard rêveur d’un jeune personnage. Un portrait raffiné, dans un décor foisonnant aux accents de spectacle.",
    year: ""
  },
  {
    title: "Garçon nez jaune",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "110 x 65 cm",
    description: "Technique mixte sur papier. Un éclair jaune traverse un visage bleu profond, ponctué de lèvres rouges. Les contrastes francs donnent à ce portrait une force graphique immédiate.",
    year: ""
  },
  {
    title: "Frère et sœur",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "65 x 65 cm",
    description: "Technique mixte sur papier. Une tête contre une épaule, deux regards unis dans un bleu profond. Un portrait tendre où se retrouve la promesse silencieuse de veiller l’un sur l’autre.",
    year: ""
  },
  {
    title: "La gitane au foulard bleu",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "140 x 98 cm",
    description: "Technique mixte sur papier. La joue posée dans sa main, une femme au foulard bleu laisse son regard s’évader. Bijoux colorés et étoffes à motifs habillent cette rêverie d’une élégance précieuse.",
    year: ""
  },
  {
    title: "La gitane au foulard bleu (mise en situation)",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "140 x 98 cm",
    description: "Technique mixte sur papier. La joue posée dans sa main, une femme au foulard bleu laisse son regard s’évader. Bijoux colorés et étoffes à motifs habillent cette rêverie d’une élégance précieuse.",
    year: ""
  },
  {
    title: "Petit garçon aux étoiles",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier. Sous une chevelure lumineuse, de grands yeux bleus semblent garder les secrets du ciel. Un portrait où l’enfance veille encore, entourée de lune et d’étoiles.",
    year: ""
  },
  {
    title: "Un amour dans la nuit",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "138 x 98 cm",
    description: "Technique mixte sur papier. Dans l’obscurité, deux êtres se serrent et deviennent leur propre lumière. Le turquoise et l’orange font vibrer cette étreinte, refuge tendre au cœur de la nuit.",
    year: ""
  },
  {
    title: "Un garçon dans la ville",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "110 x 65 cm",
    description: "Technique mixte sur papier. Le col bleu relevé, un garçon tourne son regard vers nous tandis que la ville s’esquisse derrière lui. Une rencontre fugitive dont la poésie demeure.",
    year: ""
  },
  {
    title: "Un instant d’amour",
    category: "Technique mixte",
    technique: "Technique mixte sur papier",
    dimensions: "180 x 100 cm",
    description: "Technique mixte sur papier. Une joue se blottit, une main se pose, et le monde tient dans cette proximité. Rouges ardents et fond doré donnent à cet instant la chaleur d’un souvenir précieux.",
    year: ""
  },

  // Page 4: Peinture
  {
    title: "Ange tenant l’amour",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur toile",
    dimensions: "125 x 95 cm",
    description: "Peinture acrylique et gouache sur toile. Un ange aux cheveux d’or veille sur un visage aux yeux clos. Entre bleu profond et jaune lumineux, cette étreinte célèbre la douceur d’un amour protecteur.",
    year: ""
  },
  {
    title: "Ange tenant l’amour (mise en situation)",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur toile",
    dimensions: "125 x 95 cm",
    description: "Peinture acrylique et gouache sur toile. Un ange aux cheveux d’or veille sur un visage aux yeux clos. Entre bleu profond et jaune lumineux, cette étreinte célèbre la douceur d’un amour protecteur.",
    year: ""
  },
  {
    title: "Danseuse à l’enfant",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur toile",
    dimensions: "180 x 120 cm",
    description: "Peinture acrylique et gouache sur toile. Parée de plumes majestueuses, une danseuse pose auprès d’un enfant. Couleurs éclatantes et costumes foisonnants donnent à ce duo une présence féerique.",
    year: ""
  },
  {
    title: "Garçon cheveux jaunes sur fond rouge",
    category: "Peinture",
    technique: "Peinture acrylique et gouache",
    dimensions: "125 x 95 cm",
    description: "Peinture acrylique et gouache. Sur un rouge intense, une chevelure dorée illumine un visage au regard songeur. Les touches libres révèlent un portrait vibrant, entre audace et sensibilité.",
    year: ""
  },
  {
    title: "Madame sur fond vert",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur toile",
    dimensions: "125 x 95 cm",
    description: "Peinture acrylique et gouache sur toile. Un regard violet, des lèvres écarlates et un col délicatement fleuri composent une élégance singulière. Un visage doux dont la présence retient le regard.",
    year: ""
  },
  {
    title: "Monsieur au chapeau",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur toile",
    dimensions: "125 x 95 cm",
    description: "Peinture acrylique et gouache sur toile. Sous un grand chapeau jaune, deux visages se rapprochent dans une caresse. Plumes flamboyantes et regards lumineux donnent à cette scène un charme théâtral.",
    year: ""
  },
  {
    title: "Un amour passionnel",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur papier",
    dimensions: "61 x 46 cm",
    description: "Peinture acrylique et gouache sur papier. Deux visages se frôlent sur un rouge ardent, unis par une caresse et un regard. Une composition vibrante qui saisit le trouble de l’instant avant le baiser.",
    year: ""
  },
  {
    title: "Un au revoir",
    category: "Peinture",
    technique: "Peinture acrylique et gouache sur papier",
    dimensions: "100 x 65 cm",
    description: "Peinture acrylique et gouache papier. Trois figures se serrent dans un dernier moment de proximité. Les bleus profonds et les rouges intenses font résonner toute l’émotion d’une séparation.",
    year: ""
  },

  // Page 5: Paysage
  {
    title: "Un nuage noir",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "12 x 9 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. Sous un ciel tourmenté, les toits s’accrochent à la nuit. Des éclats blancs traversent l’ombre, comme des mots emportés par le vent.",
    year: ""
  },
  {
    title: "Une campagne de guerre",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "12 x 9 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. Une demeure veille derrière les herbes sombres, ses fenêtres pleines de silence. La pluie semble porter la mémoire de ceux qui sont partis.",
    year: ""
  },
  {
    title: "Danse de nuit",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. Sous la lune d’or, les oiseaux donnent le rythme aux vagues bleues. La nuit danse, et les montagnes rouges retiennent leur souffle.",
    year: ""
  },
  {
    title: "Un silence de mort",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. Les voiles noires glissent au pied des montagnes d’ocre. Seuls les oiseaux traversent encore ce silence que la lune éclaire sans le troubler.",
    year: ""
  },
  {
    title: "Arbre",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "21 x 34 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. L’écorce garde les blessures du temps, les branches cherchent encore le ciel. Dans le bleu, cet arbre nu déploie sa force de vivant.",
    year: ""
  },
  {
    title: "Amour à la mer",
    category: "Paysage",
    technique: "Technique mixte sur papier : aquarelle et encre de Chine",
    dimensions: "61 x 46 cm",
    description: "Technique mixte sur papier : aquarelle et encre de Chine. Deux êtres se blottissent au bord d’une mer de songes. Autour d’eux, les collines roses ondulent et les oiseaux emportent la nuit.",
    year: ""
  }
];

function normalize(s) {
  return (s || '')
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function run() {
  const { data: dbArtworks, error } = await supabase.from('artworks').select('*');
  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }

  console.log(`Found ${dbArtworks.length} artworks in Supabase.`);
  let updatedCount = 0;

  for (const dbArt of dbArtworks) {
    const match = pdfArtworks.find(p => normalize(p.title) === normalize(dbArt.title));
    if (match) {
      const updatePayload = {
        title: match.title,
        category: match.category,
        technique: match.technique,
        dimensions: match.dimensions,
        description: match.description,
        year: match.year // Clear the "Non spécifiée" value
      };

      const { error: upErr } = await supabase
        .from('artworks')
        .update(updatePayload)
        .eq('id', dbArt.id);

      if (upErr) {
        console.error(`Failed to update ID ${dbArt.id} (${dbArt.title}):`, upErr);
      } else {
        console.log(`✓ Updated ID ${dbArt.id}: "${match.title}" [${match.category}] (${match.dimensions})`);
        updatedCount++;
      }
    } else {
      console.warn(`! No direct match for ID ${dbArt.id}: "${dbArt.title}"`);
    }
  }

  console.log(`\nSynchronization finished: ${updatedCount}/${dbArtworks.length} artworks updated in Supabase.`);
}

run();
