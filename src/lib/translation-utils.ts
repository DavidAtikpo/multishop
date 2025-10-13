import { Language } from './translations'

/**
 * Récupère le texte traduit d'un objet avec des colonnes de traduction
 * @param obj - L'objet contenant les colonnes de traduction
 * @param field - Le nom du champ (ex: 'name', 'description')
 * @param language - La langue demandée
 * @param fallback - Langue de fallback (par défaut 'fr')
 * @returns Le texte traduit ou le texte de fallback
 */
export function getTranslatedField(
  obj: any,
  field: string,
  language: Language,
  fallback: Language = 'fr'
): string {
  // Essayer d'abord la langue demandée
  const translatedField = `${field}_${language}`
  if (obj[translatedField] && obj[translatedField].trim()) {
    return obj[translatedField]
  }
  
  // Fallback vers la langue par défaut
  const fallbackField = `${field}_${fallback}`
  if (obj[fallbackField] && obj[fallbackField].trim()) {
    return obj[fallbackField]
  }
  
  // Fallback vers le champ original (pour compatibilité)
  if (obj[field] && obj[field].trim()) {
    return obj[field]
  }
  
  // Dernier recours
  return `[${field} non traduit]`
}

/**
 * Transforme un produit avec ses traductions
 * @param product - Le produit de la base de données
 * @param language - La langue demandée
 * @returns Le produit avec les champs traduits
 */
export function translateProduct(product: any, language: Language) {
  return {
    ...product,
    name: getTranslatedField(product, 'name', language),
    description: getTranslatedField(product, 'description', language),
  }
}

/**
 * Transforme une catégorie avec ses traductions
 * @param category - La catégorie de la base de données
 * @param language - La langue demandée
 * @returns La catégorie avec les champs traduits
 */
export function translateCategory(category: any, language: Language) {
  return {
    ...category,
    name: getTranslatedField(category, 'name', language),
    description: getTranslatedField(category, 'description', language),
  }
}

/**
 * Transforme un tableau de produits avec leurs traductions
 * @param products - Les produits de la base de données
 * @param language - La langue demandée
 * @returns Les produits avec les champs traduits
 */
export function translateProducts(products: any[], language: Language) {
  return products.map(product => translateProduct(product, language))
}

/**
 * Transforme un tableau de catégories avec leurs traductions
 * @param categories - Les catégories de la base de données
 * @param language - La langue demandée
 * @returns Les catégories avec les champs traduits
 */
export function translateCategories(categories: any[], language: Language) {
  return categories.map(category => translateCategory(category, language))
}
