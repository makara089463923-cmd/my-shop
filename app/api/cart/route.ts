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

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const cart = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: true },
  })

  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId, quantity } = await req.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existing = await prisma.cart.findFirst({
    where: { userId: user.id, productId },
  })

  if (existing) {
    const updated = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
    })
    return NextResponse.json(updated)
  }

  const cartItem = await prisma.cart.create({
    data: { userId: user.id, productId, quantity: quantity || 1 },
  })

  return NextResponse.json(cartItem)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cartId } = await req.json()

  await prisma.cart.delete({ where: { id: cartId } })

  return NextResponse.json({ message: 'Deleted' })
}
