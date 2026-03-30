import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { transactionId, status, orderId } = await req.json()

  console.log('Payment callback:', { transactionId, status, orderId })

  if (status === 'COMPLETED' && orderId) {
    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'processing' },
    })

    // Update payment status - find by transactionId
    const payment = await prisma.payment.findFirst({
      where: { transactionId },
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
