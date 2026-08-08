'use client'
import { useEffect, useState, useCallback } from 'react'
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

type StatusColor = 'pending' | 'processing' | 'completed' | 'cancelled'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ fetchAnalytics ផ្លាស់មកខាងលើ useEffect
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/admin/analytics')
      
      if (!res.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const analytics: AnalyticsData = await res.json()
      setData(analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'មានបញ្ហាក្នុងការទាញទិន្នន័យ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
    
    if (session.user?.role !== 'ADMIN' && session.user?.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchAnalytics()
  }, [session, status, router, fetchAnalytics])

  const getStatusColor = useCallback((status: string): string => {
    const colors: Record<StatusColor, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status as StatusColor] || 'bg-gray-100 text-gray-700'
  }, [])

  const getStatusText = useCallback((status: string): string => {
    const texts: Record<StatusColor, string> = {
      pending: 'កំពុងរង់ចាំ',
      processing: 'កំពុងដំណើរការ',
      completed: 'បានបញ្ចប់',
      cancelled: 'បានបោះបង់'
    }
    return texts[status as StatusColor] || status
  }, [])

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-800 mb-2">មានបញ្ហា!</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            ព្យាយាមម្តងទៀត
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const maxRevenue = data.monthlyRevenue.length > 0 
    ? Math.max(...data.monthlyRevenue.map(m => m.revenue), 1)
    : 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-500">ស្ថិតិលក់ និងដំណើរការអាជីវកម្ម</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">អ្នកប្រើសរុប</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {data.stats.totalUsers.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ផលិតផលសរុប</span>
              <span className="text-2xl">🌸</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {data.stats.totalProducts.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ការបញ្ជាទិញសរុប</span>
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {data.stats.totalOrders.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-sm border border-pink-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">ចំណូលសរុប</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-pink-600">
              ${data.stats.totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-all">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 ចំណូលប្រចាំខែ</h2>
          {data.monthlyRevenue.length > 0 ? (
            <div className="flex items-end gap-3 h-48">
              {data.monthlyRevenue.map((month, i) => {
                const height = (month.revenue / maxRevenue) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-pink-200 rounded-t-lg overflow-hidden relative">
                      <div 
                        className="w-full bg-gradient-to-t from-pink-500 to-rose-400 rounded-t-lg transition-all duration-500 hover:from-pink-600 hover:to-rose-500"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${month.revenue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                    <div className="text-xs font-medium text-gray-700">${month.revenue.toFixed(0)}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">មិនទាន់មានទិន្នន័យចំណូលទេ</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 ការបញ្ជាទិញថ្មីៗ</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{order.customer}</p>
                    <p className="text-xs text-gray-400">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('km-KH')}</p>
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
                <p className="text-gray-400 text-center py-8">មិនទាន់មានការបញ្ជាទិញទេ</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 ផលិតផលលក់ដាច់ជាងគេ</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.topProducts.map((product, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">លក់បាន {product.quantity} ដើម</p>
                    </div>
                  </div>
                  <p className="font-bold text-pink-600">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <p className="text-gray-400 text-center py-8">មិនទាន់មានការលក់ទេ</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => fetchAnalytics()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition text-sm"
          >
            🔄 ធ្វើឱ្យស្រស់
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f472b6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
    </div>
  )
}