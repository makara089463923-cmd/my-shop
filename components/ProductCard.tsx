'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import Toast from './ui/Toast'
import Image from 'next/image'

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
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState(product.image || '/flower-placeholder.png')

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id))
  }, [product.id, isInWishlist])

  async function handleAddToCart() {
    if (product.stock === 0) {
      setToastMessage('សូមទោស ផ្កានេះអស់ស្តុកហើយ')
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
    setWishlistLoading(true)

    if (isWishlisted) {
      await removeFromWishlist(product.id)
      setIsWishlisted(false)
      setToastMessage(`✓ បានលុប ${product.name} ចេញពី Wishlist`)
      setToastType('success')
      setShowToast(true)
    } else {
      await addToWishlist(product.id)
      setIsWishlisted(true)
      setToastMessage(`✓ បានបន្ថែម ${product.name} ទៅ Wishlist`)
      setToastType('success')
      setShowToast(true)
    }

    setWishlistLoading(false)
  }

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border 
border-gray-100 hover:border-pink-200">
        {/* Image Container */}
        <div 
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 cursor-pointer"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          {/* Image - Simple and guaranteed to work */}
          <div className="w-full h-full relative">
            <img 
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => {
                console.log('Image failed to load for:', product.name, 'URL:', product.image)
                setImgSrc('/flower-placeholder.png')
              }}
            />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center 
hover:scale-110 transition disabled:opacity-50"
          >
            {wishlistLoading ? (
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className={isWishlisted ? 'text-red-500 text-lg' : 'text-gray-400 text-lg'}>
                {isWishlisted ? '❤️' : '🤍'}
              </span>
            )}
          </button>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
              នៅសល់ {product.stock}
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
              អស់ស្តុក
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {product.category && (
            <span className="inline-block text-xs font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full mb-2">
              {product.category}
            </span>
          )}

          <h3 
            className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2 min-h-[56px] cursor-pointer hover:text-pink-600 
transition"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-pink-600">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400">USD</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">📦 ស្តុក:</span>
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 
'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} ដើម` : 'អស់'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className={`
              w-full py-3 rounded-xl transition-all duration-300 font-medium text-sm
              ${product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {adding ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 
014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                កំពុងបន្ថែម...
              </span>
            ) : product.stock === 0 ? (
              'អស់ស្តុក'
            ) : (
              <span className="flex items-center justify-center gap-2">
                🛒 បន្ថែមទៅកន្ត្រក
              </span>
            )}
          </button>

          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="w-full mt-2 py-2 rounded-xl text-sm font-medium border border-pink-200 text-pink-600 hover:bg-pink-50 transition 
flex items-center justify-center gap-1"
          >
            🔍 មើលលម្អិត
          </button>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}


