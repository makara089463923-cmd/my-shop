'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  category: string | null
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function addToCart() {
    setAdding(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    })

    if (res.status === 401) {
      router.push('/login')
      return
    }

    setAdded(true)
    setAdding(false)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-4 flex flex-col gap-3">
      <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {product.category && (
          <span className="text-xs text-blue-600 font-medium uppercase">{product.category}</span>
        )}
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">{product.name}</h3>
        <p className="text-blue-600 font-bold text-xl">${product.price.toFixed(2)}</p>
        <p className="text-xs text-gray-400">Stock: {product.stock}</p>
      </div>
      <button
        onClick={addToCart}
        disabled={adding}
        className={`mt-auto py-2 rounded-xl transition text-sm font-medium text-white
          ${added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}
          disabled:opacity-50`}
      >
        {added ? '✓ បានបន្ថែម!' : adding ? 'កំពុងបន្ថែម...' : 'Add to Cart 🛒'}
      </button>
    </div>
  )
}
