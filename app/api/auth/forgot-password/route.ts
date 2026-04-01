import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'សូមបញ្ចូលអ៊ីមែល' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({ message: 'ប្រសិនបើអ៊ីមែលមានក្នុងប្រព័ន្ធ តំណភ្ជាប់នឹងត្រូវបានផ្ញើ' })
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

    // In production, send email with reset link
    // For now, log the token
    console.log(`Reset link: http://localhost:3000/reset-password/${resetToken}`)

    return NextResponse.json({
      message: 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក',
      // For development only
      devLink: `http://localhost:3000/reset-password/${resetToken}`,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'មានបញ្ហា សូមសាកល្បងម្តងទៀត' }, { status: 500 })
  }
}
