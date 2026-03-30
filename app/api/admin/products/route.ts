import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// ពិនិត្យមើលថាអ្នកប្រើជា ADMIN
async function isAdmin() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return false
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })
  
  return user?.role === 'ADMIN'
}

// បន្ថែមការពិនិត្យនៅគ្រប់ API methods
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
  }

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

export async function PUT(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
  }

  const { id, name, price, image, stock, category } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price: price ? parseFloat(price) : undefined,
      image,
      stock: stock ? parseInt(stock) : undefined,
      category,
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted' })
}
