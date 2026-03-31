import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (userId !== session.user.id) {
    return NextResponse.json({ count: 0 })
  }

  try {
    const count = await prisma.wishlist.count({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching wishlist count:', error)
    return NextResponse.json({ count: 0 })
  }
}
