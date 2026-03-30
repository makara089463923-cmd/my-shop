import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { trackingNumber, courier, estimatedDate } = await req.json()
    const { id } = await params  // បន្ថែម await នៅទីនេះ

    const order = await prisma.order.update({
      where: { id },
      data: {
        trackingNumber,
        courier,
        estimatedDate: estimatedDate ? new Date(estimatedDate) : null,
        status: trackingNumber ? 'shipped' : undefined,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating tracking:', error)
    return NextResponse.json(
      { error: 'មានបញ្ហា សូមសាកម្តងទៀត' },
      { status: 500 }
    )
  }
}
