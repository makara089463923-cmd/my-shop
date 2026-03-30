import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, newPassword } = await req.json()

  if (!userId || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password យ៉ាងតិច 6 characters' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  })

  return NextResponse.json({ message: 'Password បានប្តូរដោយជោគជ័យ!' })
}
