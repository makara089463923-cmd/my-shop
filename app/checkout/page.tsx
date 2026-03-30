'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/ui/Toast'
import { useCart } from '@/context/CartContext'

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string | null
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { refreshCart } = useCart()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mock')
  const [showQR, setShowQR] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastLink, setToastLink] = useState('')
  const [toastLinkText, setToastLinkText] = useState('')

  useEffect(() => {
    fetch('/api/cart')
      .then(res => {
        if (res.status === 401) {
          router.push('/login')
          return []
        }
        return res.json()
      })
.then(data => {
  if (data?.items) {
    setCart(data.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        price: item.variant.price ?? item.variant.product.price,
        image: item.variant.product.image,
      }
    })))
    setCartId(data.id)
  }
  setLoading(false)
})
  }, [])

  async function placeOrder() {
    setPlacing(true)

    // 1. បង្កើត order
    const orderRes = await fetch('/api/orders', { method: 'POST' })
    const order = await orderRes.json()

    if (!orderRes.ok) {
      setToastMessage(order.error || 'មានបញ្ហាក្នុងការបង្កើតការបញ្ជាទិញ')
      setToastType('error')
      setShowToast(true)
      setPlacing(false)
      return
    }

    // 2. បង្កើតការបង់ប្រាក់
    const paymentRes = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, paymentMethod }),
    })

    const payment = await paymentRes.json()

    if (paymentRes.ok && payment.success) {
      setToastMessage('✅ ការបញ្ជាទិញរបស់អ្នកត្រូវបានទទួលជោគជ័យ!')
      setToastType('success')
      setToastLink(`/orders/${order.id}`)
      setToastLinkText('មើលព័ត៌មានលម្អិត →')
      setShowToast(true)
      
      // Refresh cart badge immediately
      refreshCart()
      
      setPaymentInfo(payment)
      setShowQR(true)
      
      setTimeout(async () => {
        await fetch('/api/payment/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: payment.transactionId,
            status: 'COMPLETED',
            orderId: order.id,
          }),
        })
        
        // Refresh cart badge again after payment
        refreshCart()
        
        setToastMessage('🎉 ការបង់ប្រាក់បានសម្រេច!')
        setToastType('success')
        setToastLink(`/orders/${order.id}`)
        setToastLinkText('មើលប្រវត្តិការបញ្ជាទិញ →')
        setShowToast(true)
        
        router.push(`/orders/${order.id}`)
      }, 3000)
    } else {
      setToastMessage(payment.error || 'មានបញ្ហាក្នុងការបង្កើតការបង់ប្រាក់')
      setToastType('error')
      setShowToast(true)
      setPlacing(false)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">កំពុងផ្ទុក...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">✅ Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Cart ទទេ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              ទៅ Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">?</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">សរុប</span>
                <span className="text-2xl font-bold text-pink-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">💳 ជម្រើសទូទាត់</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="mock"
                    checked={paymentMethod === 'mock'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-pink-500"
                  />
                  <div>
                    <span className="font-medium">🧪 Mock Payment (សាកល្បង)</span>
                    <p className="text-xs text-gray-400">សាកល្បងប្រព័ន្ធទូទាត់ដោយមិនគិតប្រាក់</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="aba"
                    checked={paymentMethod === 'aba'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-pink-500"
                  />
                  <div>
                    <span className="font-medium">🏦 ABA PayWay</span>
                    <p className="text-xs text-gray-400">បង់ប្រាក់តាមរយៈ ABA Mobile</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl hover:shadow-lg transition 
font-bold text-xl disabled:opacity-50"
            >
              {placing ? 'កំពុង Place Order...' : '✅ Place Order'}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl hover:bg-gray-200 transition font-medium"
            >
              ← ត្រឡប់ទៅ Cart
            </button>
          </div>
        )}
      </div>

      {showQR && paymentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">សូមស្កេន QR Code</h3>
            <p className="text-gray-500 text-sm mb-4">
              {paymentMethod === 'mock' 
                ? 'សម្រាប់សាកល្បង ប្រព័ន្ធនឹងបញ្ជាក់ដោយស្វ័យប្រវត្តិក្រោយ 3 វិនាទី'
                : 'សូមបើក ABA Mobile ដើម្បីស្កេន QR Code'}
            </p>
            {paymentInfo.qrCode && (
              <img src={paymentInfo.qrCode} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
            )}
            <div className="animate-pulse">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-400 mt-2">កំពុងរង់ចាំការបញ្ជាក់...</p>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={4000}
          link={toastLink}
          linkText={toastLinkText}
        />
      )}
    </div>
  )
}
