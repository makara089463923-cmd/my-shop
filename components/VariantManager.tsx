'use client'
import { useState, useEffect } from 'react'

type Variant = {
  id: string
  name: string
  sku: string
  price: number | null
  stock: number
  image: string | null
  attributes: any
}

export default function VariantManager({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Variant | null>(null)
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    image: '',
    color: '',
    size: '',
  })

  useEffect(() => {
    fetchVariants()
  }, [productId])

  const fetchVariants = async () => {
    const res = await fetch(`/api/admin/variants?productId=${productId}`)
    const data = await res.json()
    setVariants(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const attributes: any = {}
    if (form.color) attributes.color = form.color
    if (form.size) attributes.size = form.size

    const url = editing
      ? `/api/admin/variants`
      : '/api/admin/variants'

    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(editing && { id: editing.id }),
        productId,
        name: form.name,
        sku: form.sku,
        price: form.price ? parseFloat(form.price) : null,
        stock: parseInt(form.stock) || 0,
        image: form.image,
        attributes,
      }),
    })

    if (res.ok) {
      setForm({ name: '', sku: '', price: '', stock: '', image: '', color: '', size: '' })
      setEditing(null)
      fetchVariants()
    } else {
      alert('មានបញ្ហា')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('លុប variant នេះ?')) return
    await fetch(`/api/admin/variants?id=${id}`, { method: 'DELETE' })
    fetchVariants()
  }

  const startEdit = (variant: Variant) => {
    setEditing(variant)
    setForm({
      name: variant.name,
      sku: variant.sku,
      price: variant.price?.toString() || '',
      stock: variant.stock.toString(),
      image: variant.image || '',
      color: variant.attributes?.color || '',
      size: variant.attributes?.size || '',
    })
  }

  if (loading) return <div className="text-center py-4">កំពុងផ្ទុក...</div>

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 ជម្រើសផលិតផល (Variants)</h3>

      {/* Add/Edit Form */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <h4 className="font-medium mb-3">{editing ? 'កែប្រែជម្រើស' : 'បន្ថែមជម្រើសថ្មី'}</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="ឈ្មោះ (ឧ: ក្រហម)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="number"
            placeholder="តម្លៃ (ទុកចាស់បើមិនបញ្ចូល)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="ស្តុក"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="ពណ៌ (ឧ: ក្រហម, ស)"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="ទំហំ (ឧ: S, M, L, XL)"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="URL រូបភាព"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">
              {editing ? 'រក្សាទុក' : 'បន្ថែម'}
            </button>
            {editing && (
              <button type="button" onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-2 rounded-lg text-sm">
                បោះបង់
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Variants List */}
      <div className="space-y-2">
        {variants.length === 0 ? (
          <p className="text-gray-400 text-center py-4">មិនទាន់មានជម្រើសទេ</p>
        ) : (
          variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
              <div className="flex items-center gap-3">
                {variant.image && (
                  <img src={variant.image} alt={variant.name} className="w-10 h-10 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{variant.name}</p>
                  <p className="text-xs text-gray-400">SKU: {variant.sku}</p>
                  {variant.attributes?.color && (
                    <span className="text-xs inline-block bg-pink-100 text-pink-600 px-2 py-0.5 rounded mt-1">
                      🎨 {variant.attributes.color}
                    </span>
                  )}
                  {variant.attributes?.size && (
                    <span className="text-xs inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded mt-1 ml-1">
                      📏 {variant.attributes.size}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-pink-600">
                  ${variant.price !== null ? variant.price.toFixed(2) : 'តាមផលិតផល'}
                </p>
                <p className="text-xs text-gray-500">ស្តុក: {variant.stock}</p>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => startEdit(variant)} className="text-blue-500 text-xs">កែ</button>
                  <button onClick={() => handleDelete(variant.id)} className="text-red-500 text-xs">លុប</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
