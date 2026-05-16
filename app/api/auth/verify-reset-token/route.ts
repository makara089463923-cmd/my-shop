import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  // បើគ្មាន token ផ្ញើមក៖ ប្រាប់ Frontend ថា valid: false
  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'Token required' }, 
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        // លក្ខខណ្ឌ៖ ម៉ោងផុតកំណត់ (Expiry) ត្រូវតែធំជាង (gt) ម៉ោងបច្ចុប្បន្ន
        resetTokenExpiry: { gt: new Date() },
      },
    })

    // បើរកមិនឃើញ User ឬ Token ហួសកំណត់៖ ប្រាប់ Frontend ថា valid: false ភ្លាមៗ (លែងគាំង Loading)
    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' }, 
        { status: 200 } // ប្រើ status 200 ដើម្បីឱ្យ Frontend ងាយស្រួលចាប់យក data.valid
      )
    }

    // បើត្រឹមត្រូវ៖ ប្រាប់ Frontend ថាត្រឹមត្រូវ អាចប្តូរពាក្យសម្ងាត់បាន
    return NextResponse.json({ valid: true })

  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}