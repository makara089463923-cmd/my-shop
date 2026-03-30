import { prisma } from '@/lib/prisma'
import ReviewSection from '@/components/ReviewSection'
import RatingStars from '@/components/ui/RatingStars'
import { notFound } from 'next/navigation'
import SocialShare from '@/components/ui/SocialShare'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ដោះស្រាយ params Promise
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { name: true } } },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

{product.category && (
  <p className="text-gray-600">🌸 ប្រភេទ: {product.category}</p>
)}

{/* Social Share */}
<div className="mt-4 pt-4 border-t">
  <p className="text-sm text-gray-500 mb-2">ចែករំលែកទៅកាន់មិត្តភក្តិ៖</p>
<SocialShare
  title={product.name}
  url={`${process.env.NEXTAUTH_URL}/products/${product.id}`}
/>
​</div>
        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 aspect-square bg-gray-100">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🌸</div>
              )}
            </div>
            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <RatingStars rating={avgRating} size={18} />
                <span className="text-sm text-gray-500">({product.reviews.length} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-pink-600 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-2">📦 ស្តុក: {product.stock} ដើម</p>
              {product.category && (
                <p className="text-gray-600">🌸 ប្រភេទ: {product.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id} />
      </div>
    </div>
  )
}
