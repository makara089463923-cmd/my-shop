'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const router = useRouter()

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
        if (Array.isArray(data)) setCart(data)
        setLoading(false)
      })
  }, [])

  async function placeOrder() {
    setPlacing(true)
    const res = await fetch('/api/orders', { method: 'POST' })
    const data = await res.json()

    if (res.ok) {
      router.push(`/orders/${data.id}`)
    } else {
      alert(data.error || 'មានបញ្ហា សូមសាកម្តងទៀត')
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">✅ Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Cart ទទេ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              ទៅ Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Order Summary */}
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
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full bg-green-500 text-white py-4 rounded-2xl hover:bg-green-600 transition font-bold text-xl disabled:opacity-50"
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
    </div>
  )
}
