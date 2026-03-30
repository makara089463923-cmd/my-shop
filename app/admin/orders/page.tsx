'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

type Order = {
  id: string
  userId: string
  total: number
  status: string
  trackingNumber: string | null
  courier: string | null
  estimatedDate: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: '',
    courier: '',
    estimatedDate: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    
    fetchOrders()
  }, [session, status])

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders')
    if (res.ok) {
      const data = await res.json()
      setOrders(data)
    }
    setLoading(false)
  }

  const openTrackingModal = (order: Order) => {
    setSelectedOrder(order)
    setTrackingForm({
      trackingNumber: order.trackingNumber || '',
      courier: order.courier || '',
      estimatedDate: order.estimatedDate ? order.estimatedDate.split('T')[0] : '',
    })
    setShowModal(true)
  }

  const updateTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    const res = await fetch(`/api/admin/orders/${selectedOrder.id}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingForm),
    })

    if (res.ok) {
      setToastMessage('បានបន្ថែមលេខតាមដានដោយជោគជ័យ!')
      setToastType('success')
      setShowToast(true)
      setShowModal(false)
      fetchOrders()
    } else {
      setToastMessage('មានបញ្ហា សូមសាកម្តងទៀត')
      setToastType('error')
      setShowToast(true)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      setToastMessage(`បានប្តូរស្ថានភាពទៅ ${getStatusText(status)}`)
      setToastType('success')
      setShowToast(true)
      fetchOrders()
    }
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

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'កំពុងរង់ចាំ',
      processing: 'កំពុងរៀបចំ',
      shipped: 'កំពុងដឹកជញ្ជូន',
      delivered: 'បានប្រគល់ជូន',
      cancelled: 'បានបោះបង់',
    }
    return statusMap[status] || status
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
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">📦 គ្រប់គ្រងការបញ្ជាទិញ</h1>
          <p className="text-gray-500">គ្រប់គ្រងការបញ្ជាទិញ និងបន្ថែមលេខតាមដាន</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <h2 className="text-white font-bold text-lg">📋 បញ្ជីការបញ្ជាទិញ</h2>
            <p className="text-pink-100 text-sm mt-1">មានការបញ្ជាទិញសរុប {orders.length}</p>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-400 text-lg">មិនទាន់មានការបញ្ជាទិញទេ</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">លេខបញ្ជាទិញ</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">អតិថិជន</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">សរុប</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">ស្ថានភាព</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">លេខតាមដាន</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">កាលបរិច្ឆេទ</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-pink-50 transition">
                      <td className="py-3 px-4 font-mono text-sm">#{order.id.slice(-8)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{order.user.name}</div>
                        <div className="text-xs text-gray-400">{order.user.email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-pink-600">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1 bg-white"
                          >
                            <option value="pending">កំពុងរង់ចាំ</option>
                            <option value="processing">កំពុងរៀបចំ</option>
                            <option value="shipped">កំពុងដឹកជញ្ជូន</option>
                            <option value="delivered">បានប្រគល់ជូន</option>
                            <option value="cancelled">បានបោះបង់</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {order.trackingNumber ? (
                          <span className="text-green-600 text-sm">{order.trackingNumber}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openTrackingModal(order)}
                          className="bg-pink-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-pink-600 transition"
                        >
                          {order.trackingNumber ? 'កែលេខតាមដាន' : 'បន្ថែមលេខតាមដាន'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedOrder.trackingNumber ? 'កែប្រែលេខតាមដាន' : 'បន្ថែមលេខតាមដាន'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              ការបញ្ជាទិញ #{selectedOrder.id.slice(-8)}
            </p>
            
            <form onSubmit={updateTracking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  លេខតាមដាន
                </label>
                <input
                  type="text"
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                  placeholder="ឧទាហរណ៍: TRK123456789"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ក្រុមហ៊ុនដឹកជញ្ជូន
                </label>
                <select
                  value={trackingForm.courier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">ជ្រើសរើសក្រុមហ៊ុន...</option>
                  <option value="ABA Express">ABA Express</option>
                  <option value="VET">VET</option>
                  <option value="J&T Express">J&T Express</option>
                  <option value="Cambodia Post">Cambodia Post</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  កាលបរិច្ឆេទប៉ាន់ស្មានដល់
                </label>
                <input
                  type="date"
                  value={trackingForm.estimatedDate}
                  onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition"
                >
                  រក្សាទុក
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
                >
                  បោះបង់
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
