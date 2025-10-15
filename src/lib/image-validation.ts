/**
 * Valide si une URL d'image est valide et sécurisée
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Vérifier si l'URL contient des domaines non autorisés
  const blockedDomains = [
    'google.com',
    'google.fr',
    'bing.com',
    'yahoo.com',
    'duckduckgo.com',
    'search?',
    'search.',
    'images.google',
    'www.google.com/search'
  ]

  // Vérifier si l'URL contient des domaines bloqués
  if (blockedDomains.some(domain => url.toLowerCase().includes(domain.toLowerCase()))) {
    return false
  }

  // Vérifier si c'est une URL valide
  try {
    const urlObj = new URL(url)
    
    // Vérifier le protocole (http ou https)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }

    // Vérifier si c'est une extension d'image valide
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
    const hasValidExtension = validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    )

    // Si pas d'extension, vérifier le content-type dans l'URL (pour les services comme Cloudinary)
    const hasImageContentType = url.includes('image/') || 
                               url.includes('upload/') || 
                               url.includes('cloudinary') ||
                               url.includes('res.cloudinary')

    return hasValidExtension || hasImageContentType
  } catch {
    return false
  }
}

/**
 * Retourne une URL d'image valide ou un placeholder
 */
export function getValidImageUrl(url: string | null | undefined, placeholder: string = "/placeholder.svg"): string {
  return isValidImageUrl(url) ? url! : placeholder
}
