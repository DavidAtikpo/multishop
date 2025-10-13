import type { Product } from "@/hooks/use-cart"

export async function fetchCategories() {
  try {
    const response = await fetch('/api/products')
    if (response.ok) {
      const data = await response.json()
      return data.categories || []
    }
    return []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}






