import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import crypto from 'crypto'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${resetToken}`
    console.log('\n🔐 RESET PASSWORD LINK:')
    console.log(resetLink)
    console.log('─────────────────────────────────\n')

    return NextResponse.json({
      message: 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក',
      devLink: resetLink,
    })
  } catch (error) {
    console.error('Reset password request error:', error)
    return NextResponse.json({ error: 'មានបញ្ហា សូមសាកល្បងម្តងទៀត' }, { status: 500 })
  }
}
