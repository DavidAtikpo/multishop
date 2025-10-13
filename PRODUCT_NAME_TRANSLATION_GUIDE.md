# 🌐 Guide de Traduction des Noms de Produits

## 📋 Vue d'ensemble

Ce guide explique comment traduire les noms de produits français existants dans votre base de données pour les afficher dans différentes langues.

## ✅ Ce qui est déjà implémenté

### 🔧 **ProductCard traduit automatiquement**
- Les noms de produits se traduisent automatiquement selon la langue sélectionnée
- L'attribut `alt` des images utilise le nom traduit
- Le titre du produit affiche la version traduite

### 📚 **Système de traduction existant**
- Fichier `client-translations.ts` avec dictionnaires de traduction
- Fonction `translateProductName()` pour traduire automatiquement
- Support pour 4 langues : Français, Anglais, Allemand, Espagnol

## 🎯 Comment ça fonctionne

### 1. **Données en base (Français)**
```json
{
  "id": "1",
  "name": "Table en bois",
  "category": "Bois"
}
```

### 2. **Affichage traduit (Anglais)**
```json
{
  "id": "1", 
  "name": "Wooden Table",
  "category": "Wood"
}
```

## 📝 Traductions disponibles

### **Noms de produits traduits :**

| Français | Anglais | Allemand | Espagnol |
|----------|---------|----------|----------|
| Table en bois | Wooden Table | Holztisch | Mesa de madera |
| Vélo de montagne | Mountain Bike | Mountainbike | Bicicleta de montaña |
| Sac à dos | Backpack | Rucksack | Mochila |
| Laptop gaming | Gaming Laptop | Gaming-Laptop | Laptop gaming |
| Table en chêne | Oak Table | Eichentisch | Mesa de roble |
| Vélo électrique | Electric Bike | Elektrofahrrad | Bicicleta eléctrica |
| Ordinateur portable | Laptop | Laptop | Computadora portátil |
| Téléphone portable | Mobile Phone | Handy | Teléfono móvil |

## 🛠️ Comment ajouter de nouvelles traductions

### **Méthode 1: Modification directe du fichier**

1. Ouvrez `src/lib/client-translations.ts`
2. Ajoutez vos traductions dans `productNameTranslations` :

```typescript
export const productNameTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Table en bois": "Table en bois",
    "Nouveau Produit": "Nouveau Produit", // ← Ajoutez ici
  },
  en: {
    "Table en bois": "Wooden Table",
    "Nouveau Produit": "New Product", // ← Traduction anglaise
  },
  de: {
    "Table en bois": "Holztisch",
    "Nouveau Produit": "Neues Produkt", // ← Traduction allemande
  },
  es: {
    "Table en bois": "Mesa de madera",
    "Nouveau Produit": "Producto Nuevo", // ← Traduction espagnole
  }
}
```

### **Méthode 2: Utilisation du script**

1. Modifiez `scripts/add-product-name-translations.js`
2. Ajoutez vos traductions dans `newProductNameTranslations`
3. Exécutez le script :
   ```bash
   node scripts/add-product-name-translations.js
   ```

### **Méthode 3: Composant utilitaire (développement)**

Utilisez le composant `ProductNameTranslator` pour tester et ajouter des traductions :

```tsx
import { ProductNameTranslator } from '@/components/product-name-translator'

// Dans votre composant
<ProductNameTranslator 
  productName="Table en bois" 
  showPreview={true} 
/>
```

## 🔄 Mise à jour automatique

Le système se met automatiquement à jour quand :
- ✅ La langue change dans le header
- ✅ Les données sont rechargées
- ✅ Un nouveau produit est ajouté

## 📊 Exemples d'utilisation

### **Dans ProductCard :**
```tsx
const translatedProductName = translateProductName(product.name, language)

return (
  <h3>{translatedProductName}</h3>
  <Image alt={translatedProductName} />
)
```

### **Dans ProductGrid :**
```tsx
const translatedProducts = products.map(product => ({
  ...product,
  name: translateProductName(product.name, language)
}))
```

## 🎨 Personnalisation avancée

### **Traductions contextuelles**
Vous pouvez créer des traductions spécifiques selon le contexte :

```typescript
// Traductions selon la catégorie
const contextualTranslations = {
  "Table en bois": {
    "Mobilier": "Wooden Table",
    "Décoration": "Wooden Decorative Table"
  }
}
```

### **Traductions avec variantes**
```typescript
const variantTranslations = {
  "Table en bois": {
    en: ["Wooden Table", "Wood Table", "Timber Table"],
    de: ["Holztisch", "Holz-Tisch"],
    es: ["Mesa de madera", "Mesa de leño"]
  }
}
```

## 🚀 Prochaines étapes

### **Option 1: Continuer avec la traduction côté client**
- ✅ Simple à implémenter
- ✅ Pas de modification de la base de données
- ✅ Facile à maintenir

### **Option 2: Migration vers la base de données**
- Ajouter des colonnes `name_en`, `name_de`, `name_es` dans Prisma
- Migrer les données existantes
- Modifier les API pour supporter les traductions

## 📝 Notes importantes

- Les traductions sont stockées côté client
- Les données originales en français restent intactes
- Le système fonctionne même si une traduction manque (fallback vers le français)
- Facile à étendre pour de nouveaux produits
- Performance optimisée avec mise en cache

## 🎯 Résultat final

**Vos noms de produits se traduisent maintenant automatiquement !**

- 🇫🇷 **Français** : "Table en bois"
- 🇬🇧 **Anglais** : "Wooden Table"  
- 🇩🇪 **Allemand** : "Holztisch"
- 🇪🇸 **Espagnol** : "Mesa de madera"

Le système est prêt à l'emploi et facilement extensible ! 🚀

