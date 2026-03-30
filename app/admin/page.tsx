'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import VariantManager from '@/components/VariantManager'

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  category: string | null
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
    const res = await fetch('/api/admin/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }
{selectedProduct && (
  <VariantManager productId={selectedProduct.id} />
)}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editing
      ? `/api/admin/products?id=${editing.id}`
      : '/api/admin/products'

    const method = editing ? 'PUT' : 'POST'

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
  }

  const handleDelete = async (id: string) => {
    if (!confirm('តើចង់លុបផ្កានេះមែនទេ?')) return

    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      fetchProducts()
    } else {
      alert('លុបមិនបាន')
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
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ name: '', price: '', image: '', stock: '', category: '' })
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">🌸 Admin Dashboard</h1>
          <p className="text-gray-500">គ្រប់គ្រងផ្ការបស់អ្នកបានយ៉ាងងាយស្រួល</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">
              {editing ? '✏️ កែប្រែផ្កា' : '➕ បន្ថែមផ្កាថ្មី'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ឈ្មោះផ្កា <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="ឧទាហរណ៍: ផ្កាកុលាបក្រហម"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                តម្លៃ (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="ឧទាហរណ៍: 15"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL រូបភាព
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ចំនួនស្តុក
              </label>
              <input
                type="number"
                placeholder="ឧទាហរណ៍: 50"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ប្រភេទ
              </label>
              <input
                type="text"
                placeholder="ឧទាហរណ៍: ផ្កាកុលាប"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl transition font-medium shadow-md hover:shadow-lg"
              >
                {editing ? '💾 រក្សាទុក' : '🌺 បន្ថែមផ្កា'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl transition font-medium"
                >
                  ❌ បោះបង់
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <h2 className="text-white font-bold text-lg">📋 បញ្ជីផ្កាទាំងអស់</h2>
            <p className="text-pink-100 text-sm mt-1">មានផ្កាសរុប {products.length} ប្រភេទ</p>
          </div>

          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌸</div>
                <p className="text-gray-400 text-lg">មិនទាន់មានផ្កាទេ</p>
                <p className="text-gray-400 text-sm mt-1">សូមបន្ថែមផ្កាថ្មីខាងលើ</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">រូបភាព</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">ឈ្មោះ</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">តម្លៃ</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">ស្តុក</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">ប្រភេទ</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-pink-50 transition">
                      <td className="py-3 px-4">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-14 h-14 object-cover rounded-xl shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                            🌸
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-pink-600 font-bold">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock > 0 ? `📦 ${product.stock}` : 'ស្តុកអស់'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {product.category ? (
                          <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs">
                            {product.category}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => startEdit(product)}
                          className="text-blue-500 hover:text-blue-700 mr-4 transition"
                        >
                          ✏️ កែ
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          🗑️ លុប
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
    </div>
  )
}
