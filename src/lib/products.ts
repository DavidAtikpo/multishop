import type { Product } from "@/hooks/use-cart"

export const products: Product[] = [
  // Wood products
  {
    id: "1",
    name: "Planche de chêne massif",
    price: 89.99,
    image: "/oak-wood-plank.jpg",
    category: "wood",
    inStock: true,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: "2",
    name: "Table en bois de pin",
    price: 299.99,
    image: "/pine-wood-table.jpg",
    category: "wood",
    inStock: true,
    rating: 4.6,
    reviews: 18,
  },

  // Bikes
  {
    id: "3",
    name: "VTT Professionnel",
    price: 899.99,
    image: "/mountain-bike-professional.jpg",
    category: "bikes",
    inStock: true,
    rating: 4.9,
    reviews: 45,
  },
  {
    id: "4",
    name: "Vélo de ville électrique",
    price: 1299.99,
    image: "/electric-city-bike.png",
    category: "bikes",
    inStock: false,
    rating: 4.7,
    reviews: 32,
  },

  // Bags
  {
    id: "5",
    name: "Sac à dos cuir premium",
    price: 159.99,
    image: "/premium-leather-backpack.jpg",
    category: "bags",
    inStock: true,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "6",
    name: "Sac de voyage étanche",
    price: 79.99,
    image: "/waterproof-travel-bag.jpg",
    category: "bags",
    inStock: true,
    rating: 4.4,
    reviews: 28,
  },

  // Computers
  {
    id: "7",
    name: "Laptop Gaming Pro",
    price: 1899.99,
    image: "/gaming-laptop-professional.jpg",
    category: "computers",
    inStock: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "8",
    name: "PC Bureau Workstation",
    price: 2499.99,
    image: "/desktop-workstation-computer.jpg",
    category: "computers",
    inStock: true,
    rating: 4.9,
    reviews: 56,
  },

  // Phones
  {
    id: "9",
    name: "Smartphone Premium 5G",
    price: 899.99,
    image: "/premium-5g-smartphone.jpg",
    category: "phones",
    inStock: true,
    rating: 4.6,
    reviews: 134,
  },
  {
    id: "10",
    name: "Téléphone Classique",
    price: 299.99,
    image: "/classic-mobile-phone.jpg",
    category: "phones",
    inStock: true,
    rating: 4.3,
    reviews: 78,
  },
]

export type Category = { id: string; name?: string; icon?: string }

// Fetch categories from the database via the products API grouping
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/products?limit=1", { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.categories) ? data.categories : []
  } catch {
    return []
  }
}
