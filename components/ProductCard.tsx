'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import Toast from './ui/Toast'

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
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const isWishlisted = isInWishlist(product.id)
  
  const originalPrice = product.price * 1.2
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)
  const rating = 4.5
  const reviews = 128

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session) {
      router.push('/login')
      return
    }

    if (product.stock === 0) {
      setToastMessage('សូមទោស ផលិតផលនេះអស់ស្តុកហើយ')
      setToastType('error')
      setShowToast(true)
      return
    }

    setAdding(true)
    try {
      await addToCart(product.id)
      setToastMessage(`✓ បានបន្ថែម ${product.name} ទៅកន្ត្រកហើយ!`)
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('មានបញ្ហា សូមសាកម្តងទៀត')
      setToastType('error')
      setShowToast(true)
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session) {
      router.push('/login')
      return
    }

    if (isWishlisted) {
      await removeFromWishlist(product.id)
      setToastMessage(`✓ បានលុប ${product.name} ចេញពី Wishlist`)
      setToastType('success')
      setShowToast(true)
    } else {
      await addToWishlist(product.id)
      setToastMessage(`✓ បានបន្ថែម ${product.name} ទៅ Wishlist`)
      setToastType('success')
      setShowToast(true)
    }
  }

  return (
    <>
      <div 
        onClick={() => router.push(`/products/${product.id}`)}
        className="group relative bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full">
            -{discount}%
          </div>
        )}
        
        {/* Tag Badge */}
        {product.category && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full">
            {product.category}
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all"
        >
          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-pink-100 to-rose-100">
              🌸
            </div>
          )}
        </div>

        {/* Product Info - Same as Home page */}
        <div className="p-1.5 sm:p-2">
          <h3 className="font-semibold text-gray-800 mb-0.5 sm:mb-1 group-hover:text-blue-600 transition line-clamp-1 text-[10px] sm:text-xs">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[6px] sm:text-[8px] text-gray-500">({reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            <span className="text-[10px] sm:text-sm font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-[6px] sm:text-[8px] text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            <span className="text-[6px] sm:text-[8px] text-gray-400">📦 ស្តុក:</span>
            <span className={`text-[6px] sm:text-[8px] font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock}` : 'អស់'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full bg-gray-100 text-gray-800 py-1 sm:py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <svg className="animate-spin w-2 h-2 sm:w-2.5 sm:h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            )}
            <span className="text-[8px] sm:text-[10px] font-medium">
              {adding ? 'កំពុងបន្ថែម...' : 'បន្ថែម'}
            </span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </>
  )
}