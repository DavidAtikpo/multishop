import { Language } from './translations'

// Dictionnaire de traductions pour les catégories
export const categoryTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Bois": "Bois",
    "Vélos": "Vélos", 
    "Sacs": "Sacs",
    "Ordinateurs": "Ordinateurs",
    "Téléphones": "Téléphones",
    "Électronique": "Électronique",
    "Maison": "Maison",
    "Sport": "Sport",
    "Mode": "Mode",
    "Jardin": "Jardin"
  },
  en: {
    "Bois": "Wood",
    "Vélos": "Bikes",
    "Sacs": "Bags", 
    "Ordinateurs": "Computers",
    "Téléphones": "Phones",
    "Électronique": "Electronics",
    "Maison": "Home",
    "Sport": "Sports",
    "Mode": "Fashion",
    "Jardin": "Garden"
  },
  de: {
    "Bois": "Holz",
    "Vélos": "Fahrräder",
    "Sacs": "Taschen",
    "Ordinateurs": "Computer", 
    "Téléphones": "Telefone",
    "Électronique": "Elektronik",
    "Maison": "Haus",
    "Sport": "Sport",
    "Mode": "Mode",
    "Jardin": "Garten"
  },
  es: {
    "Bois": "Madera",
    "Vélos": "Bicicletas",
    "Sacs": "Bolsas",
    "Ordinateurs": "Computadoras",
    "Téléphones": "Teléfonos", 
    "Électronique": "Electrónica",
    "Maison": "Hogar",
    "Sport": "Deportes",
    "Mode": "Moda",
    "Jardin": "Jardín"
  }
}

// Dictionnaire de traductions pour les noms de produits courants
export const productNameTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Table en bois": "Table en bois",
    "Vélo de montagne": "Vélo de montagne",
    "Sac à dos": "Sac à dos",
    "Laptop gaming": "Laptop gaming",
    "Smartphone": "Smartphone",
    "Table en chêne": "Table en chêne",
    "Vélo électrique": "Vélo électrique",
    "Sac de voyage": "Sac de voyage",
    "Ordinateur portable": "Ordinateur portable",
    "Téléphone portable": "Téléphone portable",
    "Chaise en bois": "Chaise en bois",
    "Vélo de ville": "Vélo de ville",
    "Sac à main": "Sac à main",
    "PC de bureau": "PC de bureau",
    "iPhone": "iPhone",
    "Samsung Galaxy": "Samsung Galaxy",
    "Pallet granulés": "Pallet granulés",
    "Pallet granulé": "Pallet granulé",
    "Pallet de granulés": "Pallet de granulés",
    "Pallet Granulés": "Pallet Granulés",
    "PALLET GRANULÉS": "PALLET GRANULÉS",
    "pallet granulés": "pallet granulés",
    "Charbon": "Charbon",
    "Charbon de bois": "Charbon de bois",
    "Charbon actif": "Charbon actif",
    "Poêle à granulés et pellets": "Poêle à granulés et pellets",
    "Poêle à granulés": "Poêle à granulés",
    "Poêle granulés": "Poêle granulés",
    "Poêle à pellets": "Poêle à pellets",
    "Poêle pellets": "Poêle pellets",
    "Pallet Farners": "Pallet Farners",
    "Pallet Farmers": "Pallet Farmers",
    "Bois de chauffage": "Bois de chauffage",
    "Bois de chauffage sur palette rangé": "Bois de chauffage sur palette rangé",
    "Bois de chauffage sur palette": "Bois de chauffage sur palette",
    "VELO DE VILLE electrique": "VELO DE VILLE electrique",
    "Vélo de ville électrique": "Vélo de ville électrique",
    "Vélo électrique de ville": "Vélo électrique de ville"
  },
  en: {
    "Table en bois": "Wooden Table",
    "Vélo de montagne": "Mountain Bike", 
    "Sac à dos": "Backpack",
    "Laptop gaming": "Gaming Laptop",
    "Smartphone": "Smartphone",
    "Table en chêne": "Oak Table",
    "Vélo électrique": "Electric Bike",
    "Sac de voyage": "Travel Bag",
    "Ordinateur portable": "Laptop",
    "Téléphone portable": "Mobile Phone",
    "Chaise en bois": "Wooden Chair",
    "Vélo de ville": "City Bike",
    "Sac à main": "Handbag",
    "PC de bureau": "Desktop PC",
    "iPhone": "iPhone",
    "Samsung Galaxy": "Samsung Galaxy",
    "Pallet granulés": "Pellet Pallet",
    "Pallet granulé": "Pellet Pallet",
    "Pallet de granulés": "Pellet Pallet",
    "Pallet Granulés": "Pellet Pallet",
    "PALLET GRANULÉS": "Pellet Pallet",
    "pallet granulés": "Pellet Pallet",
    "Charbon": "Coal",
    "Charbon de bois": "Charcoal",
    "Charbon actif": "Active Coal",
    "Poêle à granulés et pellets": "Pellet and Pellets Stove",
    "Poêle à granulés": "Pellet Stove",
    "Poêle granulés": "Pellet Stove",
    "Poêle à pellets": "Pellet Stove",
    "Poêle pellets": "Pellet Stove",
    "Pallet Farners": "Farmers Pallet",
    "Pallet Farmers": "Farmers Pallet",
    "Bois de chauffage": "Firewood",
    "Bois de chauffage sur palette rangé": "Organized Firewood on Pallet",
    "Bois de chauffage sur palette": "Firewood on Pallet",
    "VELO DE VILLE electrique": "Electric City Bike",
    "Vélo de ville électrique": "Electric City Bike",
    "Vélo électrique de ville": "Electric City Bike"
  },
  de: {
    "Table en bois": "Holztisch",
    "Vélo de montagne": "Mountainbike",
    "Sac à dos": "Rucksack", 
    "Laptop gaming": "Gaming-Laptop",
    "Smartphone": "Smartphone",
    "Table en chêne": "Eichentisch",
    "Vélo électrique": "Elektrofahrrad",
    "Sac de voyage": "Reisetasche",
    "Ordinateur portable": "Laptop",
    "Téléphone portable": "Handy",
    "Chaise en bois": "Holzstuhl",
    "Vélo de ville": "Stadtrad",
    "Sac à main": "Handtasche",
    "PC de bureau": "Desktop-PC",
    "iPhone": "iPhone",
    "Samsung Galaxy": "Samsung Galaxy",
    "Pallet granulés": "Pellets-Palette",
    "Pallet granulé": "Pellets-Palette",
    "Pallet de granulés": "Pellets-Palette",
    "Pallet Granulés": "Pellets-Palette",
    "PALLET GRANULÉS": "Pellets-Palette",
    "pallet granulés": "Pellets-Palette",
    "Charbon": "Kohle",
    "Charbon de bois": "Holzkohle",
    "Charbon actif": "Aktive Kohle",
    "Poêle à granulés et pellets": "Pellets- und Pellets-Ofen",
    "Poêle à granulés": "Pellets-Ofen",
    "Poêle granulés": "Pellets-Ofen",
    "Poêle à pellets": "Pellets-Ofen",
    "Poêle pellets": "Pellets-Ofen",
    "Pallet Farners": "Bauern-Palette",
    "Pallet Farmers": "Bauern-Palette",
    "Bois de chauffage": "Brennholz",
    "Bois de chauffage sur palette rangé": "Organisiertes Brennholz auf Palette",
    "Bois de chauffage sur palette": "Brennholz auf Palette",
    "VELO DE VILLE electrique": "Elektrisches Stadtrad",
    "Vélo de ville électrique": "Elektrisches Stadtrad",
    "Vélo électrique de ville": "Elektrisches Stadtrad"
  },
  es: {
    "Table en bois": "Mesa de madera",
    "Vélo de montagne": "Bicicleta de montaña",
    "Sac à dos": "Mochila",
    "Laptop gaming": "Laptop gaming", 
    "Smartphone": "Smartphone",
    "Table en chêne": "Mesa de roble",
    "Vélo électrique": "Bicicleta eléctrica",
    "Sac de voyage": "Bolsa de viaje",
    "Ordinateur portable": "Computadora portátil",
    "Téléphone portable": "Teléfono móvil",
    "Chaise en bois": "Silla de madera",
    "Vélo de ville": "Bicicleta urbana",
    "Sac à main": "Bolso de mano",
    "PC de bureau": "PC de escritorio",
    "iPhone": "iPhone",
    "Samsung Galaxy": "Samsung Galaxy",
    "Pallet granulés": "Palé de Pellets",
    "Pallet granulé": "Palé de Pellets",
    "Pallet de granulés": "Palé de Pellets",
    "Pallet Granulés": "Palé de Pellets",
    "PALLET GRANULÉS": "Palé de Pellets",
    "pallet granulés": "Palé de Pellets",
    "Charbon": "Carbón",
    "Charbon de bois": "Carbón Vegetal",
    "Charbon actif": "Carbón Activo",
    "Poêle à granulés et pellets": "Estufa de Pellets y Pellets",
    "Poêle à granulés": "Estufa de Pellets",
    "Poêle granulés": "Estufa de Pellets",
    "Poêle à pellets": "Estufa de Pellets",
    "Poêle pellets": "Estufa de Pellets",
    "Pallet Farners": "Palé de Granjeros",
    "Pallet Farmers": "Palé de Granjeros",
    "Bois de chauffage": "Leña",
    "Bois de chauffage sur palette rangé": "Leña Organizada en Palé",
    "Bois de chauffage sur palette": "Leña en Palé",
    "VELO DE VILLE electrique": "Bicicleta Eléctrica Urbana",
    "Vélo de ville électrique": "Bicicleta Eléctrica Urbana",
    "Vélo électrique de ville": "Bicicleta Eléctrica Urbana"
  }
}

// Dictionnaire de traductions pour les descriptions courantes
export const descriptionTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Produit de haute qualité": "Produit de haute qualité",
    "Design moderne": "Design moderne",
    "Facile à utiliser": "Facile à utiliser",
    "Garantie 2 ans": "Garantie 2 ans"
  },
  en: {
    "Produit de haute qualité": "High quality product",
    "Design moderne": "Modern design", 
    "Facile à utiliser": "Easy to use",
    "Garantie 2 ans": "2 year warranty"
  },
  de: {
    "Produit de haute qualité": "Hochwertiges Produkt",
    "Design moderne": "Modernes Design",
    "Facile à utiliser": "Einfach zu verwenden", 
    "Garantie 2 ans": "2 Jahre Garantie"
  },
  es: {
    "Produit de haute qualité": "Producto de alta calidad",
    "Design moderne": "Diseño moderno",
    "Facile à utiliser": "Fácil de usar",
    "Garantie 2 ans": "Garantía de 2 años"
  }
}

/**
 * Traduit une catégorie du français vers la langue demandée
 */
export function translateCategory(categoryName: string, language: Language): string {
  if (language === 'fr') return categoryName
  
  const translations = categoryTranslations[language]
  return translations[categoryName] || categoryName
}

/**
 * Traduit un nom de produit du français vers la langue demandée
 */
export function translateProductName(productName: string, language: Language): string {
  if (language === 'fr') return productName
  
  const translations = productNameTranslations[language]
  return translations[productName] || productName
}

/**
 * Traduit une description du français vers la langue demandée
 */
export function translateDescription(description: string, language: Language): string {
  if (language === 'fr') return description
  
  const translations = descriptionTranslations[language]
  return translations[description] || description
}

/**
 * Traduit un produit complet
 */
export function translateProduct(product: any, language: Language) {
  // Utiliser les traductions de la base de données si disponibles
  const translatedName = product[`name_${language}`] || product.name
  const translatedDescription = product[`description_${language}`] || product.description
  
  return {
    ...product,
    name: translatedName,
    description: translatedDescription,
    category: translateCategory(product.category, language)
  }
}

/**
 * Traduit une catégorie complète
 */
export function translateCategoryObject(category: any, language: Language) {
  return {
    ...category,
    name: translateCategory(category.name, language)
  }
}
