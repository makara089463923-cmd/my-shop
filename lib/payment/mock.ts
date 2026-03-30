// Mock Payment Service - Active for testing
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

function generateMockQRCode(data: string): string {
  // Mock QR code for testing
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
}

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  console.log('💰 [MOCK] Creating payment for order:', request.orderId)
  console.log('💰 [MOCK] Amount:', request.amount, request.currency)
  console.log('💰 [MOCK] Customer:', request.customerName, request.customerEmail)

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 90% success rate for testing
  const isSuccess = Math.random() < 0.9

  if (isSuccess) {
    const transactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    return {
      success: true,
      transactionId,
      qrCode: generateMockQRCode(transactionId),
      deeplink: `https://mock-payment.example.com/pay/${transactionId}`,
    }
  }

  return {
    success: false,
    error: 'ការបង់ប្រាក់មិនបានសម្រេច (សាកល្បងម្តងទៀត)',
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
  console.log('💰 [MOCK] Checking payment status:', transactionId)
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true,
    transactionId,
  }
}
