import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '8')
  const skip = (page - 1) * limit

  // បង្កើតលក្ខខណ្ឌស្វែងរក
  const where: any = {}

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    }
  }

  if (category) {
    where.category = category
  }

  // យកចំនួនសរុប
  const total = await prisma.product.count({ where })

  // យកផលិតផលតាមទំព័រ
  const products = await prisma.product.findMany({
    where,
    orderBy: { id: 'desc' },
    skip,
    take: limit,
  })

  return NextResponse.json({
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(req: Request) {
  const { name, price, image, stock, category } = await req.json()

  if (!name || !price) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      image,
      stock: parseInt(stock) || 0,
      category,
    },
  })

  return NextResponse.json(product)
}
