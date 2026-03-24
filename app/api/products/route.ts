import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const { name, price, image, stock, category } = await req.json()

  if (!name || !price) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, price: parseFloat(price), image, stock: parseInt(stock) || 0, category },
  })

  return NextResponse.json(product)
}
