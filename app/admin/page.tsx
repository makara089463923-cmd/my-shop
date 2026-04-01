'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type DashboardStats = {
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
    id: string
    name: string
    quantity: number
    revenue: number
  }[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardStats | null>(null)
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
    
    fetchDashboardData()
  }, [session, status])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'កំពុងរង់ចាំ' },
      processing: { color: 'bg-blue-100 text-blue-700', text: 'កំពុងដំណើរការ' },
      completed: { color: 'bg-green-100 text-green-700', text: 'បានបញ្ចប់' },
      cancelled: { color: 'bg-red-100 text-red-700', text: 'បានបោះបង់' },
    }
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-700', text: status }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  }

  const statCards = [
    { title: 'អ្នកប្រើប្រាស់', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600', href: '/admin/users' },
    { title: 'ផលិតផល', value: stats.totalProducts, icon: '📦', color: 'from-green-500 to-green-600', href: '/admin/products' },
    { title: 'ការបញ្ជាទិញ', value: stats.totalOrders, icon: '🛒', color: 'from-purple-500 to-purple-600', href: '/admin/orders' },
    { title: 'ចំណូលសរុប', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'from-pink-500 to-rose-500', href: '/admin/orders' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">ស្វាគមន៍មកកាន់ Admin Panel</p>
        </div>
        <div className="text-xs text-gray-400">
          {new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 border border-gray-100 hover:border-pink-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl">{stat.icon}</span>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.color} opacity-10 group-hover:opacity-20 transition`} />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">{stat.title}</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stat.value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      {/* Two Column Layout - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-base sm:text-lg">ការបញ្ជាទិញថ្មីៗ</h2>
            <p className="text-gray-400 text-xs mt-0.5">10 ចុងក្រោយ</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-gray-500">លេខ</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-gray-500">អតិថិជន</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-gray-500">សរុប</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-gray-500">ស្ថានភាព</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recentOrders?.slice(0, 5).map((order) => {
                  const status = getStatusBadge(order.status)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-600 font-mono">#{order.id.slice(-6)}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-800 truncate max-w-[120px]">{order.customer}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium text-pink-500">${order.total.toFixed(2)}</td>
                      <td className="px-3 sm:px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {(!data?.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                      មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 sm:p-4 border-t border-gray-100">
            <Link href="/admin/orders" className="text-pink-500 hover:text-pink-600 text-xs sm:text-sm font-medium inline-flex items-center gap-1">
              មើលទាំងអស់
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-base sm:text-lg">ផលិតផលលក់ដាច់ជាងគេ</h2>
            <p className="text-gray-400 text-xs mt-0.5">តាមចំនួនការលក់</p>
          </div>
          
          <div className="divide-y divide-gray-50">
            {data?.topProducts?.slice(0, 5).map((product, index) => (
              <div key={product.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs">បានលក់ {product.quantity} ដុំ</p>
                  </div>
                </div>
                <p className="font-semibold text-pink-500 text-xs sm:text-sm ml-2 flex-shrink-0">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
            {(!data?.topProducts || data.topProducts.length === 0) && (
              <div className="p-6 text-center text-gray-400 text-sm">
                មិនទាន់មានទិន្នន័យលក់នៅឡើយទេ
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Revenue - Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-base sm:text-lg">ចំណូលប្រចាំខែ</h2>
          <p className="text-gray-400 text-xs mt-0.5">7 ខែកន្លងមក</p>
        </div>
        <div className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {data?.monthlyRevenue?.map((month) => (
              <div key={month.month} className="flex items-center gap-2 sm:gap-4">
                <div className="w-12 sm:w-16 text-xs sm:text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1">
                  <div 
                    className="h-6 sm:h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-md transition-all"
                    style={{ width: `${Math.min(100, (month.revenue / 5000) * 100)}%` }}
                  />
                </div>
                <div className="w-20 sm:w-24 text-right text-xs sm:text-sm font-semibold text-pink-500">
                  ${month.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
