import { Resend } from 'resend'
import { getOrderConfirmationEmail } from './emails/orderConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderData {
  id: string
  customerName: string
  customerEmail: string
  total: number
  items: OrderItem[]
  createdAt: Date
}

export async function sendOrderConfirmation(order: OrderData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [order.customerEmail],
      subject: `ការបញ្ជាទិញជោគជ័យ #${order.id.slice(-8)} - MyShop`,
      html: getOrderConfirmationEmail(order),
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
