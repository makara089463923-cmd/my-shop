'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  category: string | null
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    stock: '',
    category: '',
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
    
    fetchProducts()
  }, [session, status])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editing
      ? `/api/admin/products?id=${editing.id}`
      : '/api/admin/products'

    const method = editing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock) || 0,
          ...(editing && { id: editing.id }),
        }),
      })

      if (res.ok) {
        setForm({ name: '', price: '', image: '', stock: '', category: '' })
        setEditing(null)
        fetchProducts()
      } else {
        const error = await res.json()
        alert(error.error || 'មានបញ្ហា')
      }
    } catch (error) {
      alert('មានបញ្ហាក្នុងការភ្ជាប់ម៉ាស៊ីនមេ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('តើចង់លុបផ្កានេះមែនទេ?')) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchProducts()
      } else {
        alert('លុបមិនបាន')
      }
    } catch (error) {
      alert('មានបញ្ហាក្នុងការលុប')
    }
  }

  const startEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image || '',
      stock: product.stock.toString(),
      category: product.category || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ name: '', price: '', image: '', stock: '', category: '' })
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">📦 គ្រប់គ្រងផលិតផល</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">បន្ថែម, កែប្រែ, លុបផលិតផល</p>
        </div>
        <div className="text-xs text-gray-400">
          សរុប {products.length} ប្រភេទ
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <h2 className="font-semibold text-gray-800 mb-4">
          {editing ? '✏️ កែប្រែផលិតផល' : '➕ បន្ថែមផលិតផលថ្មី'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះផលិតផល *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ (USD) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL រូបភាព</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួនស្តុក</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទ</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="ឧ: ផ្កាកុលាប"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {editing ? '💾 រក្សាទុក' : '➕ បន្ថែម'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                ❌ បោះបង់
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">រូបភាព</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ឈ្មោះ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">តម្លៃ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ស្តុក</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ប្រភេទ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">🌸</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-pink-500">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? product.stock : 'អស់'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.category || '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(product)} className="text-blue-500 hover:text-blue-600 text-sm mr-3">✏️</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-500 text-sm">🗑️</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    មិនទាន់មានផលិតផលនៅឡើយទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
