import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-key'

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-webhook-signature')
    if (signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = await req.json()
    const {
      trackingNumber,
      status,
      courier,
      estimatedDate,
      location,
    } = body

    console.log('📦 Webhook received:', { trackingNumber, status, courier })

    const order = await prisma.order.findFirst({
      where: { trackingNumber },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Map courier status to our status
    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'confirmed': 'processing',
      'picked_up': 'processing',
      'in_transit': 'shipped',
      'out_for_delivery': 'shipped',
      'delivered': 'delivered',
      'failed': 'cancelled',
      'returned': 'cancelled',
    }

    const newStatus = statusMap[status] || order.status

    // Get current tracking history
    const currentHistory = (order.trackingHistory as any[]) || []
    
    // Add new tracking entry
    const newEntry = {
      status: newStatus,
      label: getStatusLabel(newStatus),
      date: new Date().toISOString(),
      location: location || null,
      completed: true,
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        courier: courier || order.courier,
        estimatedDate: estimatedDate ? new Date(estimatedDate) : order.estimatedDate,
        trackingHistory: [...currentHistory, newEntry],
      },
    })

    console.log('✅ Order updated:', order.id, '→', newStatus)

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      newStatus,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'pending': 'កំពុងរង់ចាំ',
    'processing': 'កំពុងរៀបចំ',
    'shipped': 'កំពុងដឹកជញ្ជូន',
    'delivered': 'បានប្រគល់ជូន',
    'cancelled': 'បានបោះបង់',
  }
  return labels[status] || status
}
