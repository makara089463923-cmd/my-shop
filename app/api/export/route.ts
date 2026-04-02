import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import * as XLSX from 'xlsx'

export async function GET() {  // ← ដក params ចេញ
  try {
    const session = await auth()
    
    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Fetch all orders
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { 
            variant: { 
              include: { 
                product: { select: { name: true } } 
              } 
            } 
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform data for Excel
    const rows = orders.flatMap(order =>
      order.items.map(item => ({
        'Order ID': order.id,
        'Order Date': new Date(order.createdAt).toLocaleDateString('km-KH'),
        'Customer Name': order.user.name,
        'Customer Email': order.user.email,
        'Product Name': (item as any).variant?.product?.name || 'N/A',
        'Quantity': item.quantity,
        'Unit Price': `$${item.price.toFixed(2)}`,
        'Subtotal': `$${(item.price * item.quantity).toFixed(2)}`,
        'Order Total': `$${order.total.toFixed(2)}`,
        'Order Status': order.status,
      }))
    )

    // Create Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows)
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Order ID
      { wch: 12 }, // Order Date
      { wch: 20 }, // Customer Name
      { wch: 25 }, // Customer Email
      { wch: 30 }, // Product Name
      { wch: 10 }, // Quantity
      { wch: 12 }, // Unit Price
      { wch: 12 }, // Subtotal
      { wch: 12 }, // Order Total
      { wch: 15 }, // Order Status
    ]

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
