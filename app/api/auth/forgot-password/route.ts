// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { Resend } from 'resend'
// import crypto from 'crypto'

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function POST(req: Request) {
//   try {
//     const { email } = await req.json()

//     if (!email) {
//       return NextResponse.json({ error: 'សូមបញ្ចូលអ៊ីមែល' }, { status: 400 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//     })

//     if (!user) {
//       return NextResponse.json({ 
//         message: 'ប្រសិនបើអ៊ីមែលមានក្នុងប្រព័ន្ធ តំណភ្ជាប់នឹងត្រូវបានផ្ញើ' 
//       })
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex')
//     const resetTokenExpiry = new Date(Date.now() + 3600000)

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         resetToken,
//         resetTokenExpiry,
//       },
//     })

//     // Use base URL without www
//     const baseUrl = process.env.NEXTAUTH_URL || 'https://drdaisy.uk'
//     const resetLink = `${baseUrl}/reset-password/${resetToken}`
    
//     const { error } = await resend.emails.send({
//       from: 'hello@drdaisy.uk',
//       to: [email],
//       subject: 'កំណត់ពាក្យសម្ងាត់ថ្មី - Petal of Praise',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h1 style="color: #ec4899;">🌸 Petal of Praise</h1>
//           <h2>កំណត់ពាក្យសម្ងាត់ថ្មី</h2>
//           <p>សូមចុចលើតំណខាងក្រោមដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី៖</p>
//           <a href="${resetLink}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
//             កំណត់ពាក្យសម្ងាត់
//           </a>
//           <p>ឬចម្លងតំណនេះ៖ <br/> <a href="${resetLink}">${resetLink}</a></p>
//           <p>តំណនេះនឹងផុតកំណត់ក្នុងរយៈពេល 1 ម៉ោង។</p>
//           <hr />
//           <p style="color: #666; font-size: 12px;">ប្រសិនបើអ្នកមិនបានស្នើសុំកំណត់ពាក្យសម្ងាត់ទេ សូមមេត្តាមិនអើពើអ៊ីមែលនេះ។</p>
//         </div>
//       `,
//     })

//     if (error) {
//       console.error('Resend error:', error)
//       return NextResponse.json({ error: 'មានបញ្ហាក្នុងការផ្ញើអ៊ីមែល' }, { status: 500 })
//     }

//     return NextResponse.json({
//       message: 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក',
//     })
//   } catch (error) {
//     console.error('Forgot password error:', error)
//     return NextResponse.json({ error: 'មានបញ្ហា សូមសាកល្បងម្តងទៀត' }, { status: 500 })
//   }
// }




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
      // 💡 បានកែសម្រួលផ្នែក html ខាងក្រោមនេះ ដើម្បីឱ្យចុចបានលើ Mobile
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #db2777; font-size: 26px; font-weight: bold; margin: 0;">🌸 Petal of Praise</h1>
          </div>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 24px;" />
          
          <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-top: 0;">កំណត់ពាក្យសម្ងាត់ថ្មី</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">សូមចុចលើប៊ូតុងខាងក្រោមដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក៖</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               target="_blank"
               style="background-color: #db2777; 
                      color: #ffffff !important; 
                      padding: 14px 32px; 
                      text-decoration: none; 
                      border-radius: 9999px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 6px rgba(219, 39, 119, 0.2);
                      -webkit-text-size-adjust: none;
                      text-align: center;">
              កំណត់ពាក្យសម្ងាត់
            </a>
          </div>
          
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">ឬប្រសិនបើប៊ូតុងខាងលើចុចមិនដើរ បងអាចចម្លងតំណភ្ជាប់ (Link) ខាងក្រោមនេះទៅដាក់លើ Browser៖</p>
          <p style="background-color: #f9fafb; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 13px;">
            <a href="${resetLink}" target="_blank" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
          </p>
          
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">⚠️ តំណភ្ជាប់នេះនឹងផុតកំណត់ក្នុងរយៈពេល 1 ម៉ោង។</p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">ប្រសិនបើអ្នកមិនបានស្នើសុំកំណត់ពាក្យសម្ងាត់ទេ សូមមេត្តាមិនអើពើអ៊ីមែលនេះ។</p>
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