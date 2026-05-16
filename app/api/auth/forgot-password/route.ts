import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

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
      return NextResponse.json({ 
        message: 'ប្រសិនបើអ៊ីមែលមានក្នុងប្រព័ន្ធ តំណភ្ជាប់នឹងត្រូវបានផ្ញើ' 
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Use base URL without www
    const baseUrl = process.env.NEXTAUTH_URL || 'https://drdaisy.uk'
    const resetLink = `${baseUrl}/reset-password/${resetToken}`
    
    const { error } = await resend.emails.send({
      from: 'hello@drdaisy.uk',
      to: [email],
      subject: 'កំណត់ពាក្យសម្ងាត់ថ្មី - Petal of Praise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">🌸 Petal of Praise</h1>
          <h2>កំណត់ពាក្យសម្ងាត់ថ្មី</h2>
          <p>សូមចុចលើតំណខាងក្រោមដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី៖</p>
          <a href="${resetLink}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
            កំណត់ពាក្យសម្ងាត់
          </a>
          <p>ឬចម្លងតំណនេះ៖ <br/> <a href="${resetLink}">${resetLink}</a></p>
          <p>តំណនេះនឹងផុតកំណត់ក្នុងរយៈពេល 1 ម៉ោង។</p>
          <hr />
          <p style="color: #666; font-size: 12px;">ប្រសិនបើអ្នកមិនបានស្នើសុំកំណត់ពាក្យសម្ងាត់ទេ សូមមេត្តាមិនអើពើអ៊ីមែលនេះ។</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'មានបញ្ហាក្នុងការផ្ញើអ៊ីមែល' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'មានបញ្ហា សូមសាកល្បងម្តងទៀត' }, { status: 500 })
  }
}
