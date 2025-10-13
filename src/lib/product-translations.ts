// Traductions des noms de produits
export const productTranslations: Record<string, Record<string, string>> = {
  // Charbon
  "Charbon": {
    "fr": "Charbon",
    "en": "Coal",
    "de": "Kohle",
    "es": "Carbón"
  },
  
  // Poêle à granulés et pellets
  "Poêle à granulés et pellets": {
    "fr": "Poêle à granulés et pellets",
    "en": "Pellet and granule stove",
    "de": "Pellet- und Granulatofen",
    "es": "Estufa de pellets y gránulos"
  },
  
  // Poêle à granulés
  "Poêle à granulés": {
    "fr": "Poêle à granulés",
    "en": "Pellet stove",
    "de": "Pelletofen",
    "es": "Estufa de pellets"
  },
  
  // Pellets y estufas de pellets
  "Pellets y estufas de pellets": {
    "fr": "Pellets et poêles à pellets",
    "en": "Pellets and pellet stoves",
    "de": "Pellets und Pelletöfen",
    "es": "Pellets y estufas de pellets"
  },
  
  // Pallet Farners
  "Pallet Farners": {
    "fr": "Palettes agricoles",
    "en": "Pallet farmers",
    "de": "Paletten-Bauern",
    "es": "Agricultores de paletas"
  },
  
  // Bois de chauffage sur palette rangé
  "Bois de chauffage sur palette rangé": {
    "fr": "Bois de chauffage sur palette rangé",
    "en": "Firewood on organized pallet",
    "de": "Brennholz auf organisierter Palette",
    "es": "Leña en paleta organizada"
  },
  
  // Bois de chauffage
  "Bois de chauffage": {
    "fr": "Bois de chauffage",
    "en": "Firewood",
    "de": "Brennholz",
    "es": "Leña"
  },
  
  // VELO DE VILLE electrique
  "VELO DE VILLE electrique": {
    "fr": "Vélo de ville électrique",
    "en": "Electric city bike",
    "de": "Elektrisches Stadtrrad",
    "es": "Bicicleta urbana eléctrica"
  },
  
  // Sac de voyage
  "Sac de voyage": {
    "fr": "Sac de voyage",
    "en": "Travel bag",
    "de": "Reisetasche",
    "es": "Bolsa de viaje"
  }
}

// Fonction pour traduire un nom de produit
export function translateProductName(productName: string, language: string): string {
  const translations = productTranslations[productName]
  if (translations && translations[language]) {
    return translations[language]
  }
  // Retourner le nom original si aucune traduction n'est trouvée
  return productName
}

// Fonction pour obtenir toutes les traductions d'un produit
export function getProductTranslations(productName: string): Record<string, string> | null {
  return productTranslations[productName] || null
}
