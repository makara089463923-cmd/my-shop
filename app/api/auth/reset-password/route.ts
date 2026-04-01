import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'តម្រូវការមិនពេញលេញ' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួ' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'តំណភ្ជាប់មិនត្រឹមត្រូវ ឬផុតកំណត់ពេលវេលាហើយ' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: 'ពាក្យសម្ងាត់ត្រូវបានកំណត់ថ្មីដោយជោគជ័យ' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'មានបញ្ហា សូមសាកល្បងម្តងទៀត' }, { status: 500 })
  }
}
