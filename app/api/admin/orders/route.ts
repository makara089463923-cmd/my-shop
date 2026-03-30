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
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
items: { include: { variant: { include: { product: { select: { name: true, image: true } } } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
