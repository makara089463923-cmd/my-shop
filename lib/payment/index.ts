import { PaymentRequest, PaymentResponse } from './mock'
import * as mockPayment from './mock'
import * as abaPayment from './abapayway'

const PAYMENT_MODE = process.env.PAYMENT_MODE || 'MOCK'

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  switch (PAYMENT_MODE) {
    case 'ABA':
      console.log('🏦 Using ABA PayWay (Real)')
      return await abaPayment.createPayment(request)
    
    case 'MOCK':
    default:
      console.log('🧪 Using Mock Payment (Testing)')
      return await mockPayment.createPayment(request)
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
  switch (PAYMENT_MODE) {
    case 'ABA':
      return await abaPayment.checkPaymentStatus(transactionId)
    
    case 'MOCK':
    default:
      return await mockPayment.checkPaymentStatus(transactionId)
  }
}
