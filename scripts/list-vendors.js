const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listVendors() {
  try {
    console.log('🔍 Liste des vendeurs disponibles:')
    console.log('=' .repeat(50))
    
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })
    
    if (vendors.length === 0) {
      console.log('❌ Aucun vendeur trouvé')
      return
    }
    
    vendors.forEach((vendor, index) => {
      console.log(`\n${index + 1}. Vendeur:`)
      console.log(`   ID: ${vendor.id}`)
      console.log(`   Nom du magasin: ${vendor.storeName}`)
      console.log(`   Utilisateur: ${vendor.user.name} (${vendor.user.email})`)
      console.log(`   Produits: ${vendor._count.products}`)
      console.log(`   Actif: ${vendor.isActive ? 'Oui' : 'Non'}`)
    })
    
    console.log('\n' + '=' .repeat(50))
    console.log(`📊 Total: ${vendors.length} vendeur(s)`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listVendors()
