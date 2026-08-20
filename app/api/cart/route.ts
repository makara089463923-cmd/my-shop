// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { auth } from '@/lib/auth'

// export async function GET() {
//   const session = await auth()
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email },
//   })

//   if (!user) {
//     return NextResponse.json(null)
//   }

//   const cart = await prisma.cart.findFirst({
//     where: { userId: user.id },
//     include: {
//       items: {
//         include: {
//           variant: {
//             include: { product: true },
//           },
//         },
//       },
//     },
//   })

//   return NextResponse.json(cart)
// }

// export async function POST(req: Request) {
//   const session = await auth()
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email },
//   })

//   if (!user) {
//     return NextResponse.json({ error: 'User not found' }, { status: 404 })
//   }

//   const { productId, quantity } = await req.json()

//   let variant = await prisma.productVariant.findFirst({
//     where: { productId },
//   })

//   if (!variant) {
//     const product = await prisma.product.findUnique({ where: { id: productId } })
//     if (!product) {
//       return NextResponse.json({ error: 'Product not found' }, { status: 404 })
//     }
//     variant = await prisma.productVariant.create({
//       data: {
//         productId,
//         name: 'Default',
//         sku: `${productId}-default`,
//         price: product.price,
//         stock: product.stock,
//         attributes: {},
//       },
//     })
//   }

//   let cart = await prisma.cart.findFirst({
//     where: { userId: user.id },
//   })

//   if (!cart) {
//     cart = await prisma.cart.create({
//       data: { userId: user.id },
//     })
//   }

//   const existing = await prisma.cartItem.findFirst({
//     where: { cartId: cart.id, variantId: variant.id },
//   })

//   if (existing) {
//     const updated = await prisma.cartItem.update({
//       where: { id: existing.id },
//       data: { quantity: existing.quantity + (quantity || 1) },
//     })
//     return NextResponse.json(updated)
//   }

//   const cartItem = await prisma.cartItem.create({
//     data: { cartId: cart.id, variantId: variant.id, quantity: quantity || 1 },
//   })

//   return NextResponse.json(cartItem)
// }

// export async function DELETE(req: Request) {
//   const session = await auth()
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const { cartItemId } = await req.json()
//   await prisma.cartItem.delete({ where: { id: cartItemId } })

//   return NextResponse.json({ message: 'Deleted' })
// }



import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          name: session.user.name || 'User',
          email: session.user.email,
          password: '',
          role: 'USER',
        },
      })
      console.log('✅ Auto-created user in cart GET:', session.user.email)
    } catch (error) {
      console.error('❌ Error auto-creating user in cart GET:', error)
      return NextResponse.json(null)
    }
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          name: session.user.name || 'User',
          email: session.user.email,
          password: '',
          role: 'USER',
        },
      })
      console.log('✅ Auto-created user in cart POST:', session.user.email)
    } catch (error) {
      console.error('❌ Error auto-creating user in cart POST:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
  }

  const { productId, quantity } = await req.json()

  let variant = await prisma.productVariant.findFirst({
    where: { productId },
  })

  if (!variant) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    variant = await prisma.productVariant.create({
      data: {
        productId,
        name: 'Default',
        sku: `${productId}-default`,
        price: product.price,
        stock: product.stock,
        attributes: {},
      },
    })
  }

  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    })
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId: variant.id },
  })

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
    })
    return NextResponse.json(updated)
  }

  const cartItem = await prisma.cartItem.create({
    data: { cartId: cart.id, variantId: variant.id, quantity: quantity || 1 },
  })

  return NextResponse.json(cartItem)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cartItemId } = await req.json()
  await prisma.cartItem.delete({ where: { id: cartItemId } })

  return NextResponse.json({ message: 'Deleted' })
}