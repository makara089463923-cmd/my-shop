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

// GET - ទាញយកទិន្នន័យ home page
export async function GET() {
  try {
    const homePage = await prisma.homePage.findFirst()
    
    if (!homePage) {
      // បង្កើត default បើមិនទាន់មាន
      const defaultHome = await prisma.homePage.create({
        data: {}
      })
      return NextResponse.json(defaultHome)
    }
    
    return NextResponse.json(homePage)
  } catch (error) {
    console.error('Error fetching home page:', error)
    return NextResponse.json({ error: 'Failed to fetch home page' }, { status: 500 })
  }
}

// PUT - ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ home page (Admin only)
export async function PUT(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
  }

  try {
    const data = await req.json()
    
    const homePage = await prisma.homePage.findFirst()
    
    if (!homePage) {
      const newHome = await prisma.homePage.create({
        data
      })
      return NextResponse.json(newHome)
    }
    
    const updated = await prisma.homePage.update({
      where: { id: homePage.id },
      data
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating home page:', error)
    return NextResponse.json({ error: 'Failed to update home page' }, { status: 500 })
  }
}