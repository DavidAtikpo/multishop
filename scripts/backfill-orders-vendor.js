const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function backfillOrdersVendor() {
  try {
    console.log('🔧 Backfill vendorId for orders without vendor...')

    const orders = await prisma.order.findMany({
      where: { vendorId: null },
      include: {
        items: {
          take: 1,
          include: { product: { select: { vendorId: true, name: true } } },
        },
      },
    })

    if (orders.length === 0) {
      console.log('✅ No orders to update')
      return
    }

    let updated = 0
    for (const order of orders) {
      const firstItem = order.items[0]
      const vId = firstItem?.product?.vendorId || null
      if (!vId) {
        console.log(`↪️ Order ${order.id} skipped (no product vendor)`) 
        continue
      }
      await prisma.order.update({
        where: { id: order.id },
        data: { vendorId: vId },
      })
      updated++
      console.log(`✅ Order ${order.id} updated -> vendorId=${vId}`)
    }

    console.log(`🏁 Backfill completed. Updated ${updated} order(s).`)
  } catch (e) {
    console.error('❌ Error during backfill:', e)
  } finally {
    await prisma.$disconnect()
  }
}

backfillOrdersVendor()
