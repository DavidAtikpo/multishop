"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from './use-language'
import { Language } from '@/lib/translations'

interface UseTranslatedDataOptions {
  endpoint: string
  params?: Record<string, string>
  enabled?: boolean
}

/**
 * Hook personnalisé pour récupérer des données traduites depuis l'API
 */
export function useTranslatedData<T>({ 
  endpoint, 
  params = {}, 
  enabled = true 
}: UseTranslatedDataOptions) {
  const { language } = useLanguage()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Ajouter la langue aux paramètres
        const searchParams = new URLSearchParams({
          ...params,
          language,
        })

        const response = await fetch(`${endpoint}?${searchParams}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, language, enabled, ...Object.values(params)])

  return { data, loading, error, refetch: () => {
    setData(null)
    setError(null)
  }}
}

/**
 * Hook spécialisé pour les produits traduits
 */
export function useTranslatedProducts(params: Record<string, string> = {}) {
  return useTranslatedData({
    endpoint: '/api/products',
    params,
  })
}

/**
 * Hook spécialisé pour un produit traduit
 */
export function useTranslatedProduct(productId: string) {
  return useTranslatedData({
    endpoint: `/api/products/${productId}`,
    enabled: !!productId,
  })
}
