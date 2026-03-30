// ABA PayWay - Real Implementation
// ⚠️ This file is ready for when you have ABA Merchant account
// To activate: change PAYMENT_MODE="ABA" in .env

export interface PaymentRequest {
  orderId: string
  amount: number
  currency: 'USD' | 'KHR'
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  qrCode?: string
  deeplink?: string
  error?: string
}

// TODO: When you get ABA Merchant account:
// 1. Install payway package: npm install payway
// 2. Uncomment the code below
// 3. Add credentials to .env

/*
import { PayWayClient } from 'payway'

const client = new PayWayClient(
  process.env.ABA_PAYWAY_API_URL!,
  process.env.ABA_PAYWAY_MERCHANT_ID!,
  process.env.ABA_PAYWAY_API_KEY!
)
*/

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // ⚠️ This is a placeholder - ABA not configured yet
  console.log('⚠️ ABA PayWay not configured. Please set up ABA credentials in .env')
  console.log('   Currently using MOCK mode. Set PAYMENT_MODE="ABA" to activate.')

  return {
    success: false,
    error: 'ABA PayWay not configured yet. Please contact administrator.',
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
  console.log('⚠️ ABA PayWay not configured. Cannot check payment status.')
  
  return {
    success: false,
    error: 'ABA PayWay not configured yet.',
  }
}

// Real implementation (uncomment when ready):
/*
export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const result = await client.create_transaction({
      tran_id: `ORDER_${request.orderId}_${Date.now()}`,
      payment_option: 'abapay_deeplink',
      amount: request.amount,
      currency: request.currency,
      return_url: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
      firstname: request.customerName.split(' ')[0] || '',
      lastname: request.customerName.split(' ').slice(1).join(' ') || '',
      email: request.customerEmail,
      phone: request.customerPhone || '',
    })

    return {
      success: true,
      transactionId: result.tran_id,
      qrCode: result.qr_image,
      deeplink: result.deeplink,
    }
  } catch (error: any) {
    console.error('ABA PayWay error:', error)
    return {
      success: false,
      error: error.message || 'Payment creation failed',
    }
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
  try {
    const result = await client.check_transaction(transactionId)
    
    return {
      success: true,
      transactionId: result.tran_id,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to check payment status',
    }
  }
}
*/
