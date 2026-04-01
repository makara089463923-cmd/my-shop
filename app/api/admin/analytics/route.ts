import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
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
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
    })

    // 7. ផលិតផលលក់ដាច់ជាងគេ - ប្រើ raw query ឬ aggregate តាម variant
    // វិធីសាស្រ្ត៖ យក order items ទាំងអស់ ហើយរាប់ផ្តុំ
    const allOrderItems = await prisma.orderItem.findMany({
      include: {
        variant: {
          include: {
            product: true
          }
        }
      }
    })

    // រាប់ផ្តុំតាម productId
    const productSales = new Map<string, { name: string; quantity: number; price: number }>()
    
    for (const item of allOrderItems) {
      const product = item.variant?.product
      if (!product) continue
      
      const existing = productSales.get(product.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        productSales.set(product.id, {
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        })
      }
    }

    // ប្រែក្លាយទៅជា array ហើយតម្រៀបតាម quantity
    const topProductsDetails = Array.from(productSales.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        revenue: data.quantity * data.price,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

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
        customer: order.user?.name || order.user?.email || 'Unknown',
        total: order.total,
        status: order.status,
        date: order.createdAt,
        itemsCount: order.items.length,
      })),
      topProducts: topProductsDetails,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
