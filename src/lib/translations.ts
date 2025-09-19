export const translations = {
    fr: {
      // Navigation
      home: "Accueil",
      products: "Produits",
      categories: "Catégories",
      cart: "Panier",
      search: "Rechercher",
      language: "Langue",
  
      // Categories
      wood: "Bois",
      bikes: "Vélos",
      bags: "Sacs",
      computers: "Ordinateurs",
      phones: "Téléphones",
  
      // Product actions
      addToCart: "Ajouter au panier",
      buyNow: "Acheter maintenant",
      viewDetails: "Voir les détails",
  
      // Hero section
      heroTitle: "Découvrez notre sélection de produits de qualité",
      heroSubtitle: "Des produits variés pour tous vos besoins : bois, vélos, sacs, ordinateurs et téléphones",
      shopNow: "Acheter maintenant",
  
      // Product info
      price: "Prix",
      inStock: "En stock",
      outOfStock: "Rupture de stock",
      rating: "Note",
      reviews: "avis",
  
      // Footer
      aboutUs: "À propos",
      contact: "Contact",
      shipping: "Livraison",
      returns: "Retours",
      privacy: "Confidentialité",
      terms: "Conditions",
  
      // Cart
      cartEmpty: "Votre panier est vide",
      total: "Total",
      checkout: "Commander",
      quantity: "Quantité",
      remove: "Supprimer",

      // Account
      account: "Compte",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      settings: "Paramètres",
      signOut: "Se déconnecter",
    },
    en: {
      // Navigation
      home: "Home",
      products: "Products",
      categories: "Categories",
      cart: "Cart",
      search: "Search",
      language: "Language",
  
      // Categories
      wood: "Wood",
      bikes: "Bikes",
      bags: "Bags",
      computers: "Computers",
      phones: "Phones",
  
      // Product actions
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      viewDetails: "View Details",
  
      // Hero section
      heroTitle: "Discover our selection of quality products",
      heroSubtitle: "Varied products for all your needs: wood, bikes, bags, computers and phones",
      shopNow: "Shop Now",
  
      // Product info
      price: "Price",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      rating: "Rating",
      reviews: "reviews",
  
      // Footer
      aboutUs: "About Us",
      contact: "Contact",
      shipping: "Shipping",
      returns: "Returns",
      privacy: "Privacy",
      terms: "Terms",
  
      // Cart
      cartEmpty: "Your cart is empty",
      total: "Total",
      checkout: "Checkout",
      quantity: "Quantity",
      remove: "Remove",

      // Account
      account: "Account",
      signIn: "Sign In",
      signUp: "Sign Up",
      settings: "Settings",
      signOut: "Sign Out",
    },
    de: {
      // Navigation
      home: "Startseite",
      products: "Produkte",
      categories: "Kategorien",
      cart: "Warenkorb",
      search: "Suchen",
      language: "Sprache",
  
      // Categories
      wood: "Holz",
      bikes: "Fahrräder",
      bags: "Taschen",
      computers: "Computer",
      phones: "Telefone",
  
      // Product actions
      addToCart: "In den Warenkorb",
      buyNow: "Jetzt kaufen",
      viewDetails: "Details anzeigen",
  
      // Hero section
      heroTitle: "Entdecken Sie unsere Auswahl an Qualitätsprodukten",
      heroSubtitle: "Vielfältige Produkte für alle Ihre Bedürfnisse: Holz, Fahrräder, Taschen, Computer und Telefone",
      shopNow: "Jetzt einkaufen",
  
      // Product info
      price: "Preis",
      inStock: "Auf Lager",
      outOfStock: "Nicht vorrätig",
      rating: "Bewertung",
      reviews: "Bewertungen",
  
      // Footer
      aboutUs: "Über uns",
      contact: "Kontakt",
      shipping: "Versand",
      returns: "Rücksendungen",
      privacy: "Datenschutz",
      terms: "AGB",
  
      // Cart
      cartEmpty: "Ihr Warenkorb ist leer",
      total: "Gesamt",
      checkout: "Zur Kasse",
      quantity: "Menge",
      remove: "Entfernen",

      // Account
      account: "Konto",
      signIn: "Anmelden",
      signUp: "Registrieren",
      settings: "Einstellungen",
      signOut: "Abmelden",
    },
    es: {
      // Navigation
      home: "Inicio",
      products: "Productos",
      categories: "Categorías",
      cart: "Carrito",
      search: "Buscar",
      language: "Idioma",
  
      // Categories
      wood: "Madera",
      bikes: "Bicicletas",
      bags: "Bolsos",
      computers: "Ordenadores",
      phones: "Teléfonos",
  
      // Product actions
      addToCart: "Añadir al carrito",
      buyNow: "Comprar ahora",
      viewDetails: "Ver detalles",
  
      // Hero section
      heroTitle: "Descubre nuestra selección de productos de calidad",
      heroSubtitle: "Productos variados para todas tus necesidades: madera, bicicletas, bolsos, ordenadores y teléfonos",
      shopNow: "Comprar ahora",
  
      // Product info
      price: "Precio",
      inStock: "En stock",
      outOfStock: "Agotado",
      rating: "Valoración",
      reviews: "reseñas",
  
      // Footer
      aboutUs: "Acerca de",
      contact: "Contacto",
      shipping: "Envío",
      returns: "Devoluciones",
      privacy: "Privacidad",
      terms: "Términos",
  
      // Cart
      cartEmpty: "Tu carrito está vacío",
      total: "Total",
      checkout: "Finalizar compra",
      quantity: "Cantidad",
      remove: "Eliminar",

      // Account
      account: "Cuenta",
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      settings: "Configuración",
      signOut: "Cerrar sesión",
    },
  } as const
  
  export type Language = keyof typeof translations
  export type TranslationKey = keyof typeof translations.fr
  