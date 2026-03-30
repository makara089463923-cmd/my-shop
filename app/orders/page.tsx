'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string | null
  }
}

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  trackingNumber?: string | null
  courier?: string | null
  estimatedDate?: string | null
  items: OrderItem[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }

    fetchOrders()
  }, [session, status])

  const fetchOrders = async () => {
    const res = await fetch('/api/orders')
    if (res.ok) {
      const data = await res.json()
      setOrders(data)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'កំពុងរង់ចាំ'
      case 'processing':
        return 'កំពុងដំណើរការ'
      case 'shipped':
        return 'កំពុងដឹកជញ្ជូន'
      case 'delivered':
        return 'បានប្រគល់ជូន'
      case 'cancelled':
        return 'បានបោះបង់'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            ប្រវត្តិការបញ្ជាទិញ
          </h1>
          <p className="text-gray-500">មើលការបញ្ជាទិញទាំងអស់របស់អ្នក</p>
          <div className="mt-3 bg-blue-50 rounded-xl p-3 max-w-md mx-auto">
            <p className="text-blue-600 text-sm flex items-center justify-center gap-2">
              <span>💡</span>
              <span>អ្នកអាចប្រើ <strong>លេខបញ្ជាទិញ</strong> ដើម្បីតាមដានការដឹកជញ្ជូន</span>
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 text-lg">អ្នកមិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              ចាប់ផ្តើមទិញទំនិញ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md 
transition">
                
                {/* Order Header - with explanation */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-white/70 text-[10px]">លេខបញ្ជាទិញ</span>
                        <span className="text-white font-mono text-sm font-bold block">#{order.id.slice(-8)}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <span className="text-white text-xs">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  
                  {/* Explanation for customer */}
                  <div className="mt-2 pt-1 border-t border-white/20">
                    <p className="text-white/70 text-[11px] flex items-center gap-1 flex-wrap">
                      <span>💡</span>
                      <span>អ្នកអាចប្រើលេខ</span>
                      <span className="text-white font-mono font-bold">#{order.id.slice(-8)}</span>
                      <span>ដើម្បី</span>
                      <Link 
                        href={`/track?orderId=${order.id}`}
                        className="text-white hover:underline font-medium"
                      >
                        តាមដានការដឹកជញ្ជូន
                      </Link>
                      <span>→</span>
                    </p>
                  </div>
                </div>

                {/* Tracking Info (if available) */}
                {order.trackingNumber && (
                  <div className="px-5 pt-4 pb-2 bg-green-50 border-b border-green-100">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-gray-500">📦 លេខតាមដាន:</span>
                      <span className="font-mono text-blue-600 font-medium">{order.trackingNumber}</span>
                      {order.courier && (
                        <span className="text-gray-400">({order.courier})</span>
                      )}
                      {order.estimatedDate && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">📅 ប៉ាន់ស្មានដល់:</span>
                          <span className="text-gray-600">{new Date(order.estimatedDate).toLocaleDateString('km-KH')}</span>
                        </>
                      )}
                      <Link
                        href={`/track?orderId=${order.id}`}
                        className="ml-auto text-pink-500 hover:text-pink-600 text-sm flex items-center gap-1"
                      >
                        🔍 តាមដាន →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="p-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
{(item.variant?.product?.image || item.product?.image) ? (
  <img 
    src={item.variant?.product?.image || item.product?.image} 
    alt={item.variant?.product?.name || item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
                        )}
                      </div>
                      <div className="flex-1">
<h3 className="font-medium text-gray-800">{item.variant?.product?.name || item.product?.name}</h3>
                        <div className="flex gap-3 text-sm text-gray-500 mt-1">
                          <span>ចំនួន: {item.quantity}</span>
                          <span>តម្លៃ: ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-gray-600">សរុបទាំងអស់</span>
                    <span className="text-2xl font-bold text-pink-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Track Button with clear explanation */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      {!order.trackingNumber && (
                        <span>⏳ កំពុងរៀបចំការដឹកជញ្ជូន...</span>
                      )}
                    </div>
                    <Link
                      href={`/track?orderId=${order.id}`}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      🔍 តាមដានការដឹកជញ្ជូន
                      <span className="text-xs text-pink-400">(លេខ #{order.id.slice(-8)})</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
