"use client"

import { ArrowRight, Star, Shield, Truck, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-3 md:py-6 overflow-hidden">
      {/* Background decoration - minimal */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500/10 rounded-full blur-xl md:w-16 md:h-16 md:top-4 md:right-4"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 bg-purple-500/20 rounded-full blur-lg md:w-12 md:h-12 md:bottom-4 md:left-4"></div>
      
      <div className="container mx-auto px-3 relative z-10">
        <div className="grid lg:grid-cols-2 gap-3 md:gap-6 items-center">
          {/* Left content - ultra compact mobile */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium mb-2">
              <Star className="h-2.5 w-2.5 fill-current" />
              <span className="text-xs">Qualité Premium</span>
            </div>
            
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
              Découvrez nos produits d'exception
            </h1>
            
            <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-4 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Une sélection unique de produits haut de gamme pour transformer votre quotidien.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center lg:justify-start mb-3 md:mb-4">
              <button className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all hover:scale-105 shadow-lg">
                Acheter maintenant
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 border border-gray-300 hover:border-blue-500 text-gray-700 rounded-lg font-medium text-xs md:text-sm transition-all hover:bg-gray-50">
                Découvrir
              </button>
            </div>
            
            {/* Features - ultra compact */}
            <div className="grid grid-cols-3 gap-1 md:gap-2 text-xs">
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                <Truck className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-600" />
                <span className="text-xs">Livraison gratuite</span>
              </div>
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                <Shield className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-600" />
                <span className="text-xs">Garantie 2 ans</span>
              </div>
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-600" />
                <span className="text-xs">Livraison rapide</span>
              </div>
            </div>
          </div>
          
          {/* Right content - very small on mobile */}
          <div className="relative mt-3 lg:mt-0">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2 md:p-4">
              {/* Featured product image - tiny on mobile */}
              <div className="relative aspect-square max-w-[200px] md:max-w-xs mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-lg blur-md"></div>
                <div className="relative bg-white rounded-lg p-2 md:p-4 shadow-lg flex items-center justify-center">
                  {/* Placeholder product */}
                  <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                      <Zap className="h-5 w-5 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements - tiny */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium animate-pulse">
                -30%
              </div>
              <div className="absolute -bottom-1 -left-1 bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                Nouveau
              </div>
            </div>
            
            {/* Stats cards - hidden on mobile, show on lg+ */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 hidden xl:block">
              <div className="bg-white rounded-lg shadow-lg p-2 text-center min-w-[60px]">
                <div className="text-lg font-bold text-blue-600">4.9</div>
                <div className="text-xs text-gray-500">★★★★★</div>
              </div>
            </div>
            
            <div className="absolute -left-2 top-1/4 hidden xl:block">
              <div className="bg-white rounded-lg shadow-lg p-2 text-center min-w-[60px]">
                <div className="text-lg font-bold text-green-600">50k+</div>
                <div className="text-xs text-gray-500">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
