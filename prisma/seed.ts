import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des produits de test
  const products = [
    {
      name: "Chaise en bois massif",
      description: "Chaise élégante en chêne massif, parfaite pour votre salle à manger",
      price: 299.99,
      image: "/placeholder.svg",
      category: "wood",
      inStock: true,
      rating: 4.5,
      reviews: 23
    },
    {
      name: "Vélo de route professionnel",
      description: "Vélo de course haut de gamme pour les cyclistes expérimentés",
      price: 1299.99,
      image: "/placeholder.svg",
      category: "bikes",
      inStock: true,
      rating: 4.8,
      reviews: 15
    },
    {
      name: "Sac à dos en cuir",
      description: "Sac à dos élégant en cuir véritable, idéal pour le travail",
      price: 199.99,
      image: "/placeholder.svg",
      category: "bags",
      inStock: true,
      rating: 4.3,
      reviews: 31
    },
    {
      name: "Laptop Gaming Pro",
      description: "Ordinateur portable gaming avec RTX 4070 et 32GB RAM",
      price: 2499.99,
      image: "/placeholder.svg",
      category: "computers",
      inStock: true,
      rating: 4.7,
      reviews: 8
    },
    {
      name: "Smartphone Premium",
      description: "Téléphone intelligent avec caméra 108MP et écran 6.7 pouces",
      price: 899.99,
      image: "/placeholder.svg",
      category: "phones",
      inStock: false,
      rating: 4.6,
      reviews: 42
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
