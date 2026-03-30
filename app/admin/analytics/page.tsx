'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type AnalyticsData = {
  stats: {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
  }
  monthlyRevenue: { month: string; revenue: number }[]
  recentOrders: {
    id: string
    customer: string
    total: number
    status: string
    date: string
  }[]
  topProducts: {
    name: string
    quantity: number
    revenue: number
  }[]
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

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
    
    fetchAnalytics()
  }, [session, status])

  const fetchAnalytics = async () => {
    const res = await fetch('/api/admin/analytics')
    if (res.ok) {
      const analytics = await res.json()
      setData(analytics)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'កំពុងរង់ចាំ'
      case 'processing': return 'កំពុងដំណើរការ'
      case 'completed': return 'បានបញ្ចប់'
      case 'cancelled': return 'បានបោះបង់'
      default: return status
    }
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

  if (!data) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-500">ស្ថិតិលក់ និងដំណើរការអាជីវកម្ម</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">អ្នកប្រើសរុប</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{data.stats.totalUsers}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ផលិតផលសរុប</span>
              <span className="text-2xl">🌸</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{data.stats.totalProducts}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ការបញ្ជាទិញសរុប</span>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{data.stats.totalOrders}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ចំណូលសរុប</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">${data.stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 ចំណូលប្រចាំខែ</h2>
          <div className="flex items-end gap-3 h-48">
            {data.monthlyRevenue.map((month, i) => {
              const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1)
              const height = (month.revenue / maxRevenue) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-pink-500 rounded-t-lg transition-all hover:bg-pink-600"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                  <div className="text-xs font-medium text-gray-700">${month.revenue.toFixed(0)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 ការបញ្ជាទិញថ្មីៗ</h2>
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium text-gray-800">{order.customer}</p>
                    <p className="text-xs text-gray-400">#{order.id.slice(-8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
              {data.recentOrders.length === 0 && (
                <p className="text-gray-400 text-center py-4">មិនទាន់មានការបញ្ជាទិញទេ</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 ផលិតផលលក់ដាច់ជាងគេ</h2>
            <div className="space-y-3">
              {data.topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📦'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">លក់បាន {product.quantity} ដើម</p>
                    </div>
                  </div>
                  <p className="font-bold text-pink-600">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <p className="text-gray-400 text-center py-4">មិនទាន់មានការលក់ទេ</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
