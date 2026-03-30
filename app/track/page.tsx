'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Toast from '@/components/ui/Toast'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image: string | null
  }
}

type TrackingHistory = {
  status: string
  label: string
  date: string | null
  completed: boolean
}

type Order = {
  id: string
  total: number
  status: string
  trackingNumber: string | null
  courier: string | null
  estimatedDate: string | null
  createdAt: string
  items: OrderItem[]
  user: {
    name: string
    email: string
  }
}

export default function TrackPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '')
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('trackingNumber') || '')
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const params = new URLSearchParams()
    if (orderId) params.append('orderId', orderId)
    if (trackingNumber) params.append('trackingNumber', trackingNumber)

    const res = await fetch(`/api/orders/track?${params.toString()}`)
    const data = await res.json()

    if (res.ok) {
      setOrder(data.order)
      setTrackingHistory(data.trackingHistory)
      router.push(`/track?${params.toString()}`)
    } else {
      setError(data.error || 'មិនឃើញការបញ្ជាទិញទេ')
      setToastMessage(data.error || 'មិនឃើញការបញ្ជាទិញទេ')
      setToastType('error')
      setShowToast(true)
    }

    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'កំពុងរង់ចាំ' },
      processing: { color: 'bg-blue-100 text-blue-700', text: 'កំពុងរៀបចំ' },
      shipped: { color: 'bg-purple-100 text-purple-700', text: 'កំពុងដឹកជញ្ជូន' },
      delivered: { color: 'bg-green-100 text-green-700', text: 'បានប្រគល់ជូន' },
      cancelled: { color: 'bg-red-100 text-red-700', text: 'បានបោះបង់' },
    }
    const info = statusMap[status] || { color: 'bg-gray-100 text-gray-700', text: status }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>{info.text}</span>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'កំពុងរង់ចាំ'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📦</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">តាមដានការបញ្ជាទិញ</h1>
          <p className="text-gray-500">
            បញ្ចូលលេខបញ្ជាទិញ ឬលេខតាមដានដើម្បីពិនិត្យស្ថានភាព
          </p>

          {/* Quick Link for logged-in users */}
          {session ? (
            <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-2xl inline-block">
              <p className="text-sm text-gray-600 mb-2">
                👋 សួស្តី <strong>{session.user?.name}</strong>! ចង់មើល orders របស់អ្នក?
              </p>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-xl transition text-sm 
font-medium"
              >
                📋 មើល Orders របស់ខ្ញុំ
              </Link>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl inline-block">
              <p className="text-sm text-gray-600 mb-2">
                💡 Login ដើម្បីមើល orders ដោយស្វ័យប្រវត្តិ!
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition text-sm 
font-medium"
              >
                🔐 Login ឥឡូវ
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 border-t border-gray-200"/>
          <span className="text-gray-400 text-sm">ឬ track ដោយ manual</span>
          <div className="flex-1 border-t border-gray-200"/>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                លេខបញ្ជាទិញ
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ឧទាហរណ៍: cmn8p86zq0000y19ku3xj1nv7"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm focus:outline-none 
focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
              />
            </div>

            <div className="text-center text-gray-400 text-sm">ឬ</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                លេខតាមដាន
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="ឧទាហរណ៍: TRK123456789"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm focus:outline-none 
focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!orderId && !trackingNumber)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-base font-medium text-white 
bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 
12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'តាមដានស្ថានភាពកូដឥឡូវនេះ'
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {order && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">ការបញ្ជាទិញ #{order.id.slice(-8)}</h2>
                  <p className="text-sm text-gray-500 mt-1">កាលបរិច្ឆេទ: {formatDate(order.createdAt)}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {order.trackingNumber && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600"><strong>លេខតាមដាន:</strong> {order.trackingNumber}</p>
                  {order.courier && (
                    <p className="text-sm text-gray-600 mt-1"><strong>ក្រុមហ៊ុនដឹកជញ្ជូន:</strong> {order.courier}</p>
                  )}
                  {order.estimatedDate && (
                    <p className="text-sm text-gray-600 mt-1"><strong>ប៉ាន់ស្មានដល់:</strong> {formatDate(order.estimatedDate)}</p>
                  )}
                </div>
              )}

              <h3 className="font-semibold text-gray-800 mb-3">ផលិតផល</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
{(item.variant?.product?.image || item.product?.image) ? (
  <img src={item.variant?.product?.image || item.product?.image} alt={item.variant?.product?.name || item.product?.name} className="w-full 
h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>
                      )}
                    </div>
                    <div className="flex-1">
<p className="font-medium text-gray-800">{item.variant?.product?.name || item.product?.name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-bold text-pink-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">សរុប</span>
                <span className="text-xl font-bold text-pink-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">ស្ថានភាពការដឹកជញ្ជូន</h2>
              <div className="relative">
                {trackingHistory.map((step, idx) => (
                  <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                    {idx < trackingHistory.length - 1 && (
                      <div className={`absolute left-5 top-8 w-0.5 h-full ${step.completed ? 'bg-pink-500' : 'bg-gray-200'}`} />
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <h3 className={`font-semibold ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </h3>
                        {step.date && (
                          <span className="text-xs text-gray-400">{formatDate(step.date)}</span>
                        )}
                      </div>
                      {step.completed && step.status === 'shipped' && order.trackingNumber && (
                        <p className="text-sm text-pink-500 mt-1">លេខតាមដាន: {order.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  )
}
