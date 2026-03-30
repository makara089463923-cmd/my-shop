import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'សូមបំពេញព័ត៌មានទាំងអស់' },
        { status: 400 }
      )
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'unread',
      },
    })

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [process.env.ADMIN_EMAIL || 'makara089463923@gmail.com'],
        subject: `សារថ្មីពី ${name}: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>សារថ្មីពី ${name}</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 
4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #ec489a; margin-bottom: 20px;">📧 សារថ្មីពី ${name}</h2>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <p><strong>ឈ្មោះ:</strong> ${name}</p>
                <p><strong>អ៊ីមែល:</strong> ${email}</p>
                <p><strong>ប្រធានបទ:</strong> ${subject}</p>
                <p><strong>កាលបរិច្ឆេទ:</strong> ${new Date().toLocaleString('km-KH')}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #374151;">សារ៖</h3>
                <p style="color: #4b5563; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px;">
                  សារនេះត្រូវបានផ្ញើពី Contact Form នៃហាងរបស់អ្នក
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!',
      contactId: contact.id,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'មានបញ្ហា សូមសាកម្តងទៀត' },
      { status: 500 }
    )
  }
}

// GET - សម្រាប់ admin មើលសារ
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined

  const contacts = await prisma.contact.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(contacts)
}

// PATCH - ធ្វើបច្ចុប្បន្នភាពស្ថានភាពសារ
export async function PATCH(req: Request) {
  const { id, status } = await req.json()

  const contact = await prisma.contact.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(contact)
}
