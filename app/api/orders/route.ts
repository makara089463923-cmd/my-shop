import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST() {
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

  const userCart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  if (!userCart || userCart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const cartItems = userCart.items
  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const total = cartItems.reduce(
    (sum: number, item: any) => 
      sum + (item.variant.price ?? item.variant.product.price) * item.quantity, 0
  )

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      items: {
        create: cartItems.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price ?? item.variant.product.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  await prisma.cart.deleteMany({ where: { userId: user.id } })

  console.log('📧 កំពុងផ្ញើអ៊ីមែលទៅ:', user.email)
  
  const emailResult = await sendOrderConfirmation({
    id: order.id,
    customerName: user.name || 'Customer',
    customerEmail: user.email || '',
    total: order.total,
    items: order.items.map((item: any) => ({
      name: item.variant?.product?.name || 'Product',
      quantity: item.quantity,
      price: item.price,
    })),
    createdAt: order.createdAt,
  })

  if (emailResult.success) {
    console.log('✅ អ៊ីមែលបានផ្ញើជោគជ័យ!')
  } else {
    console.log('❌ អ៊ីមែលផ្ញើមិនបាន:', emailResult.error)
  }

  return NextResponse.json(order)
}

export async function GET() {
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

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { variant: { include: { product: true } } } } },
  })

  return NextResponse.json(orders)
}