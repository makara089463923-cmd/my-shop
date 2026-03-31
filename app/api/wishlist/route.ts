import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    console.log('🔍 Wishlist GET - Session:', session?.user?.id)
    
    if (!session?.user?.id) {
      console.log('❌ No session, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    })

    console.log(`✅ Found ${wishlist.length} wishlist items for user ${session.user.id}`)
    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    console.log('🔍 Wishlist POST - Session:', session?.user?.id)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist' }, { status: 200 })
    }

    // Add to wishlist
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId: productId
      }
    })

    console.log(`✅ Added product ${productId} to wishlist for user ${session.user.id}`)
    return NextResponse.json({ message: 'Added to wishlist', wishlist }, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()
    
    // Check if exists before deleting
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 })
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId
        }
      }
    })

    console.log(`✅ Removed product ${productId} from wishlist for user ${session.user.id}`)
    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
