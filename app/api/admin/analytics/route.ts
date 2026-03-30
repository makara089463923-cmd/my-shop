import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 1. ចំនួនអ្នកប្រើសរុប
  const totalUsers = await prisma.user.count()

  // 2. ចំនួនផលិតផលសរុប
  const totalProducts = await prisma.product.count()

  // 3. ចំនួនការបញ្ជាទិញសរុប
  const totalOrders = await prisma.order.count()

  // 4. ចំណូលសរុប
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ['completed', 'processing'] } },
  })

  // 5. ចំណូលប្រចាំខែ (7 ខែកន្លងមក)
  const last7Months = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    
    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: date, lt: nextDate },
        status: { in: ['completed', 'processing'] },
      },
    })
    
    last7Months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: revenue._sum.total || 0,
    })
  }

  // 6. ការបញ្ជាទិញថ្មីៗ (10 ចុងក្រោយ)
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  // 7. ផលិតផលលក់ដាច់ជាងគេ
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  })

  const topProductsDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, price: true },
      })
      return {
        name: product?.name || 'Unknown',
        quantity: item._sum.quantity,
        revenue: (item._sum.quantity || 0) * (product?.price || 0),
      }
    })
  )

  return NextResponse.json({
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    },
    monthlyRevenue: last7Months,
    recentOrders: recentOrders.map(order => ({
      id: order.id,
      customer: order.user.name,
      total: order.total,
      status: order.status,
      date: order.createdAt,
    })),
    topProducts: topProductsDetails,
  })
}
