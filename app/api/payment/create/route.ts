import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { orderId, paymentMethod } = await req.json()

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: user.id },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Mock payment - always success
  const transactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      method: paymentMethod.toUpperCase(),
      status: 'PENDING',
      transactionId,
    },
  })

  // Mock QR code
  const qrCode = 
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

  return NextResponse.json({
    success: true,
    transactionId,
    qrCode,
    deeplink: `https://mock-payment.example.com/pay/${transactionId}`,
  })
}
