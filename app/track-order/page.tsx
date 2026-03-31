'use client'
import { useState } from 'react'
import Link from 'next/link'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'

type TrackingHistoryItem = {
  status: string
  label: string
  date: string | null
  completed: boolean
}

type OrderItem = {
  id: string
  quantity: number
  price: number
  variant: {
    product: {
      name: string
      image: string | null
    }
  }
}

type Order = {
  id: string
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
  trackingNumber: string | null
  items: OrderItem[]
  user: {
    name: string
    email: string
    phone?: string
    address?: string
  }
}

const statusIcons = {
  pending: '📝',
  confirmed: '✓',
  processing: '⚙️',
  shipped: '🚚',
  delivered: '✅',
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
}

const statusKhmer = {
  pending: 'កំពុងរង់ចាំ',
  confirmed: 'បានបញ្ជាក់',
  processing: 'កំពុងរៀបចំ',
  shipped: 'កំពុងដឹកជញ្ជូន',
  delivered: 'បានប្រគល់ជូន',
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [searchType, setSearchType] = useState<'orderId' | 'trackingNumber'>('orderId')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistoryItem[]>([])
  const [error, setError] = useState('')

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const searchValue = searchType === 'orderId' ? orderId : trackingNumber
    if (!searchValue.trim()) {
      setError('សូមបញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដាន')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)
    setTrackingHistory([])

    try {
      const params = new URLSearchParams()
      if (searchType === 'orderId') {
        params.append('orderId', orderId)
      } else {
        params.append('trackingNumber', trackingNumber)
      }
      
      const res = await fetch(`/api/orders/track?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setOrder(data.order)
        setTrackingHistory(data.trackingHistory)
      } else {
        setError(data.error || 'រកមិនឃើញការបញ្ជាទិញនេះទេ')
      }
    } catch (error) {
      setError('មានបញ្ហាក្នុងការភ្ជាប់ម៉ាស៊ីនមេ')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'កំពុងរង់ចាំ'
    return new Date(dateString).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCurrentStatus = () => {
    if (!order) return null
    return {
      text: statusKhmer[order.status as OrderStatus] || order.status,
      color: statusColors[order.status as OrderStatus] || 'bg-gray-100 text-gray-700',
      icon: statusIcons[order.status as OrderStatus] || '📦',
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            តាមដានការបញ្ជាទិញ
          </h1>
          <p className="text-gray-500 text-sm">
            បញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដាន ដើម្បីតាមដានស្ថានភាព
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setSearchType('orderId')}
              className={`pb-2 px-2 text-sm font-medium transition ${
                searchType === 'orderId'
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              🔑 ស្វែងរកតាមលេខបញ្ជាទិញ
            </button>
            <button
              onClick={() => setSearchType('trackingNumber')}
              className={`pb-2 px-2 text-sm font-medium transition ${
                searchType === 'trackingNumber'
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              📦 ស្វែងរកតាមលេខតាមដាន
            </button>
          </div>

          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchType === 'orderId' ? orderId : trackingNumber}
              onChange={(e) => {
                if (searchType === 'orderId') {
                  setOrderId(e.target.value)
                } else {
                  setTrackingNumber(e.target.value)
                }
              }}
              placeholder={searchType === 'orderId' 
                ? "លេខបញ្ជាទិញ (ឧទាហរណ៍: ORD-12345)" 
                : "លេខតាមដាន (ឧទាហរណ៍: TRK-12345)"}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'កំពុងស្វែងរក...' : 'តាមដាន'}
            </button>
          </form>
          
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {order && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">ស្ថានភាពការបញ្ជាទិញ</h2>
              <div className="relative">
                {trackingHistory.map((item, index) => (
                  <div key={item.status} className="flex mb-6 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {item.completed ? '✓' : index + 1}
                      </div>
                      {index < trackingHistory.length - 1 && (
                        <div className={`w-0.5 h-12 mt-1 ${
                          item.completed && trackingHistory[index + 1]?.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-gray-800">{item.label}</p>
                        {item.date && (
                          <p className="text-xs text-gray-400 mt-1 sm:mt-0">{formatDate(item.date)}</p>
                        )}
                      </div>
                      {!item.completed && item.status === order.status && (
                        <p className="text-xs text-pink-500 mt-1">កំពុងដំណើរការ...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-gray-500 text-sm mb-1">ស្ថានភាពបច្ចុប្បន្ន</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCurrentStatus()?.color}`}>
                    {getCurrentStatus()?.icon} {getCurrentStatus()?.text}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-1">កាលបរិច្ឆេទបញ្ជា</p>
                  <p className="text-gray-800 text-sm font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">លេខតាមដាន</p>
                  <p className="text-gray-800 text-sm font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">បញ្ជីផ្កា</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {item.variant.product.image ? (
                        <img src={item.variant.product.image} alt={item.variant.product.name} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">🌸</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.variant.product.name}</p>
                        <p className="text-gray-400 text-xs">ចំនួន: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-pink-500 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <p className="font-bold text-gray-800">សរុប</p>
                <p className="text-pink-600 font-bold text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">ព័ត៌មានអតិថិជន</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">ឈ្មោះ:</span> {order.user.name}</p>
                <p><span className="text-gray-500">អ៊ីមែល:</span> {order.user.email}</p>
                {order.user.phone && <p><span className="text-gray-500">ទូរស័ព្ទ:</span> {order.user.phone}</p>}
                {order.user.address && <p><span className="text-gray-500">អាសយដ្ឋាន:</span> {order.user.address}</p>}
              </div>
            </div>

            <div className="text-center">
              <Link href="/contact" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 text-sm">
                <span>❓</span> មានបញ្ហា? ទាក់ទងមកយើងខ្ញុំ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
