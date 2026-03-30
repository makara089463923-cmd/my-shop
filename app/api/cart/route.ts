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

  const cart = await prisma.cart.findFirst({
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

  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { productId, quantity } = await req.json()

  // រក variant default សម្រាប់ product នេះ
  let variant = await prisma.productVariant.findFirst({
    where: { productId },
  })

  // បើគ្មាន variant → បង្កើត default variant
  if (!variant) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
variant = await prisma.productVariant.create({
  data: {
    productId,
    name: 'Default',
    sku: `${productId}-default`,
    price: product.price,
    stock: product.stock,
    attributes: {},
  },
})
  }

  // រក ឬបង្កើត cart
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    })
  }

  // ពិនិត្យ existing cart item
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId: variant.id },
  })

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
    })
    return NextResponse.json(updated)
  }

  const cartItem = await prisma.cartItem.create({
    data: { cartId: cart.id, variantId: variant.id, quantity: quantity || 1 },
  })

  return NextResponse.json(cartItem)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cartItemId } = await req.json()
  await prisma.cartItem.delete({ where: { id: cartItemId } })

  return NextResponse.json({ message: 'Deleted' })
}
