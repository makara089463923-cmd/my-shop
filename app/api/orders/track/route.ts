import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const trackingNumber = searchParams.get('trackingNumber')

  if (!orderId && !trackingNumber) {
    return NextResponse.json(
      { error: 'សូមបញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដាន' },
      { status: 400 }
    )
  }

  let order = null

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
items: { include: { variant: { include: { product: true } } } },
        user: { select: { name: true, email: true } },
      },
    })
  } else if (trackingNumber) {
    order = await prisma.order.findFirst({
      where: { trackingNumber },
      include: {     
items: { include: { variant: { include: { product: true } } } },
        user: { select: { name: true, email: true } },
      },
    })
  }

  if (!order) {
    return NextResponse.json(
      { error: 'មិនឃើញការបញ្ជាទិញទេ' },
      { status: 404 }
    )
  }

  // Tracking status history
  const trackingHistory = [
    { status: 'pending', label: 'កំពុងរង់ចាំ', date: order.createdAt, completed: true },
    { status: 'confirmed', label: 'បានបញ្ជាក់', date: new Date(order.createdAt.getTime() + 3600000), completed: order.status !== 
'pending' },
    { status: 'processing', label: 'កំពុងរៀបចំ', date: new Date(order.createdAt.getTime() + 86400000), completed: order.status === 
'processing' || order.status === 'shipped' || order.status === 'delivered' },
    { status: 'shipped', label: 'បានដឹកជញ្ជូន', date: order.trackingNumber ? new Date(order.createdAt.getTime() + 172800000) : null, 
completed: order.status === 'shipped' || order.status === 'delivered' },
    { status: 'delivered', label: 'បានប្រគល់ជូន', date: order.status === 'delivered' ? order.updatedAt : null, completed: order.status === 
'delivered' },
  ]

  return NextResponse.json({
    order,
    trackingHistory,
  })
}
