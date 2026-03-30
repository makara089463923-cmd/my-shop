import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { productId, name, sku, price, stock, image, attributes } = await req.json()

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      name,
      sku,
      price: price || null,
      stock: stock || 0,
      image,
      attributes: attributes || {},
    },
  })

  return NextResponse.json(variant)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(variants)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, name, sku, price, stock, image, attributes } = await req.json()

  const variant = await prisma.productVariant.update({
    where: { id },
    data: { name, sku, price, stock, image, attributes },
  })

  return NextResponse.json(variant)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Variant ID required' }, { status: 400 })
  }

  await prisma.productVariant.delete({ where: { id } })

  return NextResponse.json({ message: 'Deleted' })
}
