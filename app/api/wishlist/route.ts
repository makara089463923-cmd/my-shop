import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET - យក wishlist របស់អ្នកប្រើ
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

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(wishlist)
}

// POST - បន្ថែមទៅ wishlist
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

  const { productId } = await req.json()

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  // ពិនិត្យថាមានស្រាប់ឬអត់
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Already in wishlist' }, { status: 400 })
  }

  const wishlist = await prisma.wishlist.create({
    data: {
      userId: user.id,
      productId,
    },
    include: { product: true },
  })

  return NextResponse.json(wishlist)
}

// DELETE - លុបពី wishlist
export async function DELETE(req: Request) {
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

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  })

  return NextResponse.json({ message: 'Removed from wishlist' })
}
