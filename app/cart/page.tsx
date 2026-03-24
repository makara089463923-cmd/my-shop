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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
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

  async function removeItem(cartId: string) {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId }),
    })
    setCart(cart.filter(item => item.id !== cartId))
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Cart</h1>

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
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-blue-600 font-bold">${item.product.price.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    លុប
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-sm border p-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">សរុប</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium text-lg"
            >
              Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
