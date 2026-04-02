
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
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentProof(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  async function placeOrder() {
    setPlacing(true)

    // Upload payment proof if not COD
    let proofUrl = null
    if (paymentMethod !== 'cod' && paymentProof) {
      const formData = new FormData()
      formData.append('file', paymentProof)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        proofUrl = uploadData.url
      } else {
        setToastMessage('មិនអាចផ្ទុកភស្តុតាងបាន សូមសាកល្បងម្តងទៀត')
        setToastType('error')
        setShowToast(true)
        setPlacing(false)
        return
      }
    }

    // Create order with payment info
    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod,
        paymentProof: proofUrl,
      }),
    })
    const order = await orderRes.json()

    if (!orderRes.ok) {
      setToastMessage(order.error || 'មានបញ្ហាក្នុងការបង្កើតការបញ្ជាទិញ')
      setToastType('error')
      setShowToast(true)
      setPlacing(false)
      return
    }

    // Success message based on payment method
    if (paymentMethod === 'cod') {
      setToastMessage('✅ ការបញ្ជាទិញរបស់អ្នកត្រូវបានទទួលជោគជ័យ! យើងនឹងទាក់ទងអ្នកឆាប់ៗ')
      setToastType('success')
      setToastLink(`/orders/${order.id}`)
      setToastLinkText('មើលព័ត៌មានលម្អិត →')
      setShowToast(true)
      
      refreshCart()
      
      setTimeout(() => {
        router.push(`/orders/${order.id}`)
      }, 2000)
    } else {
      setToastMessage('📸 សូមរង់ចាំការបញ្ជាក់ពីរដ្ឋបាល (រយៈពេល 24 ម៉ោង)')
      setToastType('success')
      setToastLink(`/orders/${order.id}`)
      setToastLinkText('មើលព័ត៌មានលម្អិត →')
      setShowToast(true)
      
      refreshCart()
      
      setTimeout(() => {
        router.push(`/orders/${order.id}`)
      }, 3000)
    }
    
    setPlacing(false)
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">កំពុងផ្ទុក...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">បញ្ជាក់ការបញ្ជាទិញ</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-400 text-lg">កន្ត្រកទទេ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              ទៅទិញទំនិញ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">បញ្ជីផលិតផល</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 py-2 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">🌸</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-500">ចំនួន: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-pink-500">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t">
                <span className="font-bold text-gray-800">សរុប</span>
                <span className="font-bold text-pink-500 text-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">វិធីទូទាត់</h2>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-pink-500"
                  />
                  <div>
                    <span className="font-medium">💰 កាបង់ប្រាក់ (Cash on Delivery)</span>
                    <p className="text-xs text-gray-400">បង់ប្រាក់ពេលទទួលទំនិញ</p>
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
                    <span className="font-medium">🏦 ABA Bank</span>
                    <p className="text-xs text-gray-400">ផ្ទេរតាម ABA Mobile</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-pink-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="wing"
                    checked={paymentMethod === 'wing'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-pink-500"
                  />
                  <div>
                    <span className="lock text-sm font-medium text-gray-700 mb-2">🪙 ផ្ទេរតាមរយះលេខគណនាហាងផ្ទាល់</span>
                    <p className="block text-sm font-medium text-gray-700 mb-2">ផ្ទេរតាម​លេខគណនា
</p>
                  </div>
                </label>
              </div>

              {/* Bank Info for Transfer */}
              {paymentMethod !== 'cod' && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-medium text-yellow-800 mb-2">📱 ព័ត៌មានផ្ទេរប្រាក់</p>
                  <p className="text-sm text-yellow-700">គណនី: <strong>Petal of Praise</strong></p>
                  <p className="text-sm text-yellow-700">លេខគណនី: <strong>001 234 567</strong></p>
                  <p className="text-sm text-yellow-700">ឈ្មោះ: <strong>MAKARA KHIN</strong></p>
                  <p className="text-xs text-yellow-600 mt-2">* សូមផ្ទេរប្រាក់តាមចំនួនទឹកប្រាក់ខាងលើ</p>
                </div>
              )}

              {/* Payment Proof Upload */}
              {paymentMethod !== 'cod' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ភស្តុតាងការផ្ទេរប្រាក់ (Screenshot)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">* អាចផ្ញើរូបភាព JPG, PNG</p>
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={placing || (paymentMethod !== 'cod' && !paymentProof)}
                className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50"
              >
                {placing ? 'កំពុងដំណើរការ...' : 'បញ្ជាក់ការបញ្ជាទិញ'}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full mt-3 bg-gray-100 text-gray-600 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                ← ត្រឡប់ទៅកន្ត្រក
              </button>
            </div>
          </div>
        )}
      </div>

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


