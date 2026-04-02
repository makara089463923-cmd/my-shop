'use client'
import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Toast from '@/components/ui/Toast'
import { useState } from 'react'

export default function WishlistPage() {
​​  const { wishlist, wishlistCount, loading, removeFromWishlist, refreshWishlist } = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleAddToCart = async (productId: string, productName: string) => {
    setAddingId(productId)
    try {
      await addToCart(productId)
      setToastMessage(`✓ បានបន្ថែម ${productName} ទៅកន្ត្រកហើយ!`)
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('មានបញ្ហា សូមសាកម្តងទៀត')
      setToastType('error')
      setShowToast(true)
    } finally {
      setAddingId(null)
    }
  }

  const handleRemove = async (productId: string, productName: string) => {
    await removeFromWishlist(productId)
    setToastMessage(`✓ បានលុប ${productName} ចេញពី Wishlist`)
    setToastType('success')
    setShowToast(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ❤️ ផ្កាដែលអ្នកចូលចិត្ត
          </h1>
          <p className="text-gray-500">
            {wishlistCount === 0 
              ? 'មិនទាន់មានផ្កាក្នុង Wishlist ទេ'
              : `មាន ${wishlistCount} ប្រភេទក្នុង Wishlist`
            }
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-400 text-lg">មិនទាន់មានផ្កាក្នុង Wishlist ទេ</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition"
            >
              ចាប់ផ្តើមបន្ថែមផ្កា
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg 
transition group">
                {/* Image */}
                <div 
                  className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/products/${item.product.id}`)}
                >
                  {item.product.image ? (
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🌸
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(item.product.id, item.product.name)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center 
hover:scale-110 transition"
                  >
                    <span className="text-red-500 text-lg">❤️</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  {item.product.category && (
                    <span className="inline-block text-xs font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full mb-2">
                      {item.product.category}
                    </span>
                  )}
                  
                  {/* Name */}
                  <h3 
                    className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600 line-clamp-2"
                    onClick={() => router.push(`/products/${item.product.id}`)}
                  >
                    {item.product.name}
                  </h3>
                  
                  {/* Price */}
                  <p className="text-pink-600 font-bold text-xl mb-3">
                    ${item.product.price.toFixed(2)}
                  </p>
                  
                  {/* Stock */}
                  <p className={`text-xs mb-3 ${item.product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.product.stock > 0 ? `📦 ស្តុក: ${item.product.stock} ដើម` : 'អស់ស្តុក'}
                  </p>
                  
                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item.product.id, item.product.name)}
                      disabled={addingId === item.product.id || item.product.stock === 0}
                      className={`flex-1 py-2 rounded-xl transition text-sm font-medium ${
                        item.product.stock === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {addingId === item.product.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          កំពុងបន្ថែម...
                        </div>
                      ) : item.product.stock === 0 ? (
                        'អស់ស្តុក'
                      ) : (
                        '🛒 Add to Cart'
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  )
}
