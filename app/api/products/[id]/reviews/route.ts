import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET - យក reviews នៃ product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return NextResponse.json({
    reviews,
    averageRating: avgRating,
    totalReviews: reviews.length,
  })
}

// POST - បន្ថែម review ថ្មី
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const { rating, comment } = await req.json()

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
  }

  // ពិនិត្យថាអតិថិជនបានទិញផលិតផលនេះហើយឬនៅ
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId: id,
      order: {
        userId: user.id,
        status: { in: ['completed', 'processing'] },
      },
    },
  })

  if (!hasPurchased) {
    return NextResponse.json(
      { error: 'You can only review products you have purchased' },
      { status: 403 }
    )
  }

  // ពិនិត្យថាបានវាយតម្លៃរួចហើយឬនៅ
  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: id,
      },
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'You have already reviewed this product' },
      { status: 400 }
    )
  }

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      productId: id,
      rating,
      comment,
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })

  return NextResponse.json(review)
}

// PUT - កែប្រែ review
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const { rating, comment } = await req.json()

  const review = await prisma.review.update({
    where: {
      userId_productId: {
        userId: user.id,
        productId: id,
      },
    },
    data: { rating, comment },
  })

  return NextResponse.json(review)
}
