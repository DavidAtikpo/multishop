const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function assignProductsToVendor() {
  try {
    const vendorId = 'cmg80pmgi0003vea4h9el39qn'
    
    console.log('🔍 Recherche des produits sans vendeur...')
    
    // Vérifier que le vendeur existe
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId }
    })
    
    if (!vendor) {
      console.error('❌ Vendeur non trouvé avec l\'ID:', vendorId)
      return
    }
    
    console.log('✅ Vendeur trouvé:', vendor.storeName)
    
    // Compter les produits sans vendeur
    const productsWithoutVendor = await prisma.product.count({
      where: { vendorId: null }
    })
    
    console.log(`📊 ${productsWithoutVendor} produits sans vendeur trouvés`)
    
    if (productsWithoutVendor === 0) {
      console.log('✅ Tous les produits ont déjà un vendeur assigné')
      return
    }
    
    // Mettre à jour tous les produits sans vendeur
    const result = await prisma.product.updateMany({
      where: { vendorId: null },
      data: { vendorId: vendorId }
    })
    
    console.log(`✅ ${result.count} produits assignés au vendeur ${vendor.storeName}`)
    
    // Vérifier le résultat
    const updatedProducts = await prisma.product.count({
      where: { vendorId: vendorId }
    })
    
    console.log(`📈 Total de produits pour ce vendeur: ${updatedProducts}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
assignProductsToVendor()
