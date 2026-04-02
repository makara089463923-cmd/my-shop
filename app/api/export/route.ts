import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import * as XLSX from 'xlsx'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

const orders = await prisma.order.findMany({
  include: {
    user: { select: { name: true, email: true } },
    items: {
      include: { variant: { include: { product: { select: { name: true } } } } },
    },
  },
  orderBy: { createdAt: 'desc' },
})

  const rows = orders.flatMap(order =>
    order.items.map(item => ({
      'Order ID': order.id,
      'Customer Name': order.user.name,
      'Customer Email': order.user.email,
      'Product': item.product.name,
      'Quantity': item.quantity,
      'Price': `$${item.price.toFixed(2)}`,
      'Total': `$${order.total.toFixed(2)}`,
      'Status': order.status,
      'Date': new Date(order.createdAt).toLocaleDateString(),
    }))
  )

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="orders.xlsx"',
    },
  })
}
