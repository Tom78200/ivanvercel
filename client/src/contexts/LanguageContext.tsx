import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions
const translations = {
  fr: {
    // Navigation
    'nav.gallery': 'Œuvres',
    'nav.exhibitions': 'Expositions',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    
    // Page principale
    'home.title': 'IVAN GAUTHIER',
    'home.subtitle': 'Artiste Contemporain',
    'home.loading': 'Chargement de la galerie...',
    'home.no-artworks': 'Galerie en préparation',
    'home.no-artworks-desc': 'Les œuvres seront bientôt disponibles.',
    
    // Galerie
    'gallery.title': 'Galerie',
    'gallery.no-artworks': 'Aucune œuvre pour le moment.',
    'gallery.others': 'Autres',
    
    // Expositions
    'exhibitions.title': 'Expositions',
    'exhibitions.no-exhibitions': 'Aucune exposition pour le moment.',
    'exhibitions.details': 'Détails',
    'exhibitions.close': 'Fermer',
    
    // À propos
    'about.title': 'À propos',
    'about.bio': 'Biographie',
    'about.technique': 'Technique',
    'about.exhibitions': 'Expositions',
    
    // Contact
    'contact.title': 'Contact',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer',
    'contact.info': 'Informations',
    'contact.address': 'Adresse',
    'contact.email': 'Email',
    
    // Admin
    'admin.title': 'Admin',
    'admin.password': 'Mot de passe',
    'admin.login': 'Se connecter',
    'admin.dashboard': 'Dashboard Admin',
    'admin.manage-exhibitions': 'Gérer les expositions',
    'admin.add-artwork': 'Uploader une œuvre',
    'admin.artwork-title': 'Titre',
    'admin.artwork-technique': 'Technique',
    'admin.artwork-year': 'Année',
    'admin.artwork-dimensions': 'Dimensions',
    'admin.artwork-description': 'Description',
    'admin.artwork-category': 'Choisir une catégorie…',
    'admin.artwork-image': 'Image',
    'admin.artwork-add': 'Ajouter l\'œuvre',
    'admin.artwork-cancel': 'Annuler',
    'admin.artwork-order': 'Ordre des œuvres (glisser‑déposer)',
    'admin.artwork-save-order': 'Enregistrer l\'ordre',
    'admin.artwork-list': 'Liste des œuvres',
    'admin.artwork-add-photos': 'Ajouter photos',
    'admin.artwork-delete': 'Supprimer',
    'admin.artwork-max-reached': 'Max atteint',
    'admin.artwork-additional-images': 'Ajouter des images supplémentaires',
    'admin.artwork-add-images': 'Ajouter',
    'admin.artwork-cancel-images': 'Annuler',
    
    // Lightbox
    'lightbox.close': 'Fermer la fenêtre d\'aperçu',
    'lightbox.previous': 'Image précédente',
    'lightbox.next': 'Image suivante',
    'lightbox.go-to': 'Aller à l\'image',
    
    // Général
    'general.loading': 'Chargement...',
    'general.error': 'Erreur',
    'general.success': 'Succès',
    'general.cancel': 'Annuler',
    'general.save': 'Enregistrer',
    'general.delete': 'Supprimer',
    'general.edit': 'Modifier',
    'general.add': 'Ajouter',
    'general.close': 'Fermer',
    'general.open': 'Ouvrir',
    'general.previous': 'Précédent',
    'general.next': 'Suivant',
    
    // Catégories d'œuvres
    'category.aquarelle': 'Aquarelle',
    'category.peinture': 'Peinture',
    'category.technique_mixte': 'Technique mixte',
    'category.portrait': 'Portrait',
    'category.paysage': 'Paysage',
    'category.abstraction': 'Abstraction',
    'category.abstrait': 'Abstrait',
    'category.nature_morte': 'Nature morte',
    'category.urbain': 'Urbain',
    'category.figuratif': 'Figuratif',
    'category.expressionnisme': 'Expressionnisme',
    'category.scene_de_vie': 'Scène de vie',
    'category.marin': 'Marin',
    'category.animalier': 'Animalier',
    'category.nu': 'Nu',
    'category.impressionnisme': 'Impressionnisme',
    'category.surrealisme': 'Surréalisme',
    'category.cubisme': 'Cubisme',
    'category.minimalisme': 'Minimalisme',
    'category.symbolisme': 'Symbolisme',
    'category.realiste': 'Réaliste',
    'category.post_impressionnisme': 'Post‑impressionnisme',
    'category.baroque': 'Baroque',
    'category.renaissance': 'Renaissance',
    'category.fauvisme': 'Fauvisme',
    'category.art_brut': 'Art brut',
    'category.street_art': 'Street art',
    'category.pop_art': 'Pop art',
    'category.art_naif': 'Art naïf',
    'category.art_deco': 'Art déco',
    'category.art_nouveau': 'Art nouveau',
    'category.calligraphie': 'Calligraphie',
    'category.paysage_urbain': 'Paysage urbain',
    'category.paysage_marin': 'Paysage marin',
    'category.nature_abstraite': 'Nature abstraite',
    'category.portrait_abstrait': 'Portrait abstrait',
    'category.contemporain': 'Contemporain',
    'category.autres': 'Autres',
  },
  en: {
    // Navigation
    'nav.gallery': 'Artworks',
    'nav.exhibitions': 'Exhibitions',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Page principale
    'home.title': 'IVAN GAUTHIER',
    'home.subtitle': 'Contemporary Artist',
    'home.loading': 'Loading gallery...',
    'home.no-artworks': 'Gallery in preparation',
    'home.no-artworks-desc': 'Artworks will be available soon.',
    
    // Galerie
    'gallery.title': 'Gallery',
    'gallery.no-artworks': 'No artworks at the moment.',
    'gallery.others': 'Others',
    
    // Expositions
    'exhibitions.title': 'Exhibitions',
    'exhibitions.no-exhibitions': 'No exhibitions at the moment.',
    'exhibitions.details': 'Details',
    'exhibitions.close': 'Close',
    
    // À propos
    'about.title': 'About',
    'about.bio': 'Biography',
    'about.technique': 'Technique',
    'about.exhibitions': 'Exhibitions',
    
    // Contact
    'contact.title': 'Contact',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send',
    'contact.info': 'Information',
    'contact.address': 'Address',
    'contact.email': 'Email',
    
    // Admin
    'admin.title': 'Admin',
    'admin.password': 'Password',
    'admin.login': 'Login',
    'admin.dashboard': 'Admin Dashboard',
    'admin.manage-exhibitions': 'Manage exhibitions',
    'admin.add-artwork': 'Upload artwork',
    'admin.artwork-title': 'Title',
    'admin.artwork-technique': 'Technique',
    'admin.artwork-year': 'Year',
    'admin.artwork-dimensions': 'Dimensions',
    'admin.artwork-description': 'Description',
    'admin.artwork-category': 'Choose a category…',
    'admin.artwork-image': 'Image',
    'admin.artwork-add': 'Add artwork',
    'admin.artwork-cancel': 'Cancel',
    'admin.artwork-order': 'Artwork order (drag & drop)',
    'admin.artwork-save-order': 'Save order',
    'admin.artwork-list': 'Artwork list',
    'admin.artwork-add-photos': 'Add photos',
    'admin.artwork-delete': 'Delete',
    'admin.artwork-max-reached': 'Max reached',
    'admin.artwork-additional-images': 'Add additional images',
    'admin.artwork-add-images': 'Add',
    'admin.artwork-cancel-images': 'Cancel',
    
    // Lightbox
    'lightbox.close': 'Close preview window',
    'lightbox.previous': 'Previous image',
    'lightbox.next': 'Next image',
    'lightbox.go-to': 'Go to image',
    
    // Général
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.success': 'Success',
    'general.cancel': 'Cancel',
    'general.save': 'Save',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.add': 'Add',
    'general.close': 'Close',
    'general.open': 'Open',
    'general.previous': 'Previous',
    'general.next': 'Next',
    
    // Catégories d'œuvres
    'category.aquarelle': 'Watercolor',
    'category.peinture': 'Painting',
    'category.technique_mixte': 'Mixed Media',
    'category.portrait': 'Portrait',
    'category.paysage': 'Landscape',
    'category.abstraction': 'Abstract',
    'category.abstrait': 'Abstract',
    'category.nature_morte': 'Still Life',
    'category.urbain': 'Urban',
    'category.figuratif': 'Figurative',
    'category.expressionnisme': 'Expressionism',
    'category.scene_de_vie': 'Scene of Life',
    'category.marin': 'Seascape',
    'category.animalier': 'Animal',
    'category.nu': 'Nude',
    'category.impressionnisme': 'Impressionism',
    'category.surrealisme': 'Surrealism',
    'category.cubisme': 'Cubism',
    'category.minimalisme': 'Minimalism',
    'category.symbolisme': 'Symbolism',
    'category.realiste': 'Realist',
    'category.post_impressionnisme': 'Post-Impressionism',
    'category.baroque': 'Baroque',
    'category.renaissance': 'Renaissance',
    'category.fauvisme': 'Fauvism',
    'category.art_brut': 'Outsider Art',
    'category.street_art': 'Street Art',
    'category.pop_art': 'Pop Art',
    'category.art_naif': 'Naïve Art',
    'category.art_deco': 'Art Deco',
    'category.art_nouveau': 'Art Nouveau',
    'category.calligraphie': 'Calligraphy',
    'category.paysage_urbain': 'Urban Landscape',
    'category.paysage_marin': 'Seascape',
    'category.nature_abstraite': 'Abstract Nature',
    'category.portrait_abstrait': 'Abstract Portrait',
    'category.contemporain': 'Contemporary',
    'category.autres': 'Others',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
        return;
      }
      const nav = (navigator?.language || navigator?.languages?.[0] || '').toLowerCase();
      if (nav.startsWith('fr')) setLanguage('fr');
      else setLanguage('en');
    } catch {
      setLanguage('en');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
