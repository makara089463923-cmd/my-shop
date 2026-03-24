import ProductCard from '@/components/ProductCard'

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store',
  })
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛍️ Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">មិនទាន់មាន product ទេ</p>
            <p className="text-sm mt-2">សូម add product នៅ admin page</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
