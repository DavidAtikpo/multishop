# 🌐 Guide de Traduction des Données

## 📋 Vue d'ensemble

Ce guide explique comment traduire les données françaises existantes dans votre base de données pour les afficher dans différentes langues.

## 🚀 Implémentation Actuelle

### ✅ Ce qui est déjà fait :

1. **Traduction côté client** - Les données françaises sont traduites directement dans le composant
2. **Dictionnaires de traduction** - Fichier `client-translations.ts` avec les traductions
3. **Composant ProductGrid mis à jour** - Utilise les traductions automatiquement
4. **Support multilingue** - Français, Anglais, Allemand, Espagnol

## 📁 Fichiers Modifiés

- `src/components/product-grid.tsx` - Composant principal avec traductions
- `src/lib/client-translations.ts` - Dictionnaires de traduction
- `src/lib/translations.ts` - Clés de traduction pour l'interface
- `scripts/add-product-translations.js` - Script pour ajouter des traductions

## 🔧 Comment Ajouter de Nouvelles Traductions

### 1. **Pour les Catégories**

Modifiez le fichier `src/lib/client-translations.ts` :

```typescript
export const categoryTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Bois": "Bois",
    "Vélos": "Vélos",
    "Nouvelle Catégorie": "Nouvelle Catégorie", // ← Ajoutez ici
  },
  en: {
    "Bois": "Wood",
    "Vélos": "Bikes", 
    "Nouvelle Catégorie": "New Category", // ← Traduction anglaise
  },
  // ... autres langues
}
```

### 2. **Pour les Noms de Produits**

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
  // ... autres langues
}
```

### 3. **Pour les Descriptions**

```typescript
export const descriptionTranslations: Record<Language, Record<string, string>> = {
  fr: {
    "Produit de haute qualité": "Produit de haute qualité",
    "Nouvelle description": "Nouvelle description", // ← Ajoutez ici
  },
  en: {
    "Produit de haute qualité": "High quality product",
    "Nouvelle description": "New description", // ← Traduction anglaise
  },
  // ... autres langues
}
```

## 🛠️ Utilisation du Script d'Ajout

1. **Modifiez le script** `scripts/add-product-translations.js`
2. **Ajoutez vos traductions** dans les objets `newProductTranslations` et `newCategoryTranslations`
3. **Exécutez le script** :
   ```bash
   node scripts/add-product-translations.js
   ```

## 🎯 Comment ça Fonctionne

1. **Récupération des données** - L'API retourne les données en français
2. **Traduction automatique** - Le composant traduit les données selon la langue sélectionnée
3. **Affichage** - Les données traduites sont affichées à l'utilisateur

## 📊 Exemple de Données

### Données en Base (Français) :
```json
{
  "id": "1",
  "name": "Table en bois",
  "category": "Bois",
  "description": "Produit de haute qualité"
}
```

### Données Affichées (Anglais) :
```json
{
  "id": "1", 
  "name": "Wooden Table",
  "category": "Wood",
  "description": "High quality product"
}
```

## 🔄 Mise à Jour Automatique

Le composant `ProductGrid` se met automatiquement à jour quand :
- La langue change dans le header
- Les données sont rechargées
- Une nouvelle catégorie est sélectionnée

## 🚀 Prochaines Étapes

### Option 1: Continuer avec la traduction côté client
- ✅ Simple à implémenter
- ✅ Pas de modification de la base de données
- ✅ Facile à maintenir

### Option 2: Migration vers la base de données
- Ajouter des colonnes de traduction dans Prisma
- Migrer les données existantes
- Modifier les API pour supporter les traductions

## 🎨 Personnalisation

Vous pouvez facilement :
- Ajouter de nouvelles langues
- Modifier les traductions existantes
- Ajouter de nouveaux types de données à traduire
- Créer des traductions contextuelles

## 📝 Notes Importantes

- Les traductions sont stockées côté client
- Les données originales en français restent intactes
- Le système fonctionne même si une traduction manque (fallback vers le français)
- Facile à étendre pour de nouveaux produits/catégories
