'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import Toast from '@/components/ui/Toast'

const featuredProducts = [
  {
    id: 1,
    name: 'Multi Pocket School Backpack',
    price: 49.59,
    originalPrice: 59.99,
    image: '/images/logo.png',
    rating: 4.8,
    reviews: 128,
    discount: 20,
    tag: 'Hot',
  },
  {
    id: 2,
    name: 'Baseball Cap',
    price: 9.95,
    originalPrice: 14.99,
    image: '/images/logo.png',
    rating: 4.7,
    reviews: 95,
    discount: 30,
    tag: 'Sale',
  },
  {
    id: 3,
    name: 'Regular Fit T-Shirt With Printed',
    price: 7.59,
    originalPrice: 12.99,
    image: '/images/logo.png',
    rating: 4.6,
    reviews: 76,
    discount: 30,
    tag: 'Best Seller',
  },
  {
    id: 4,
    name: 'Hoodie Sweatshirt',
    price: 29.99,
    originalPrice: 49.99,
    image: '/images/logo.png',
    rating: 4.9,
    reviews: 42,
    discount: 40,
    tag: 'Limited',
  },
  {
    id: 5,
    name: 'Sports Shoes',
    price: 39.99,
    originalPrice: 69.99,
    image: '/images/logo.png',
    rating: 4.8,
    reviews: 203,
    discount: 43,
    tag: 'Flash Sale',
  },
  {
    id: 6,
    name: 'Denim Jeans',
    price: 24.99,
    originalPrice: 39.99,
    image: '/images/logo.png',
    rating: 4.7,
    reviews: 156,
    discount: 38,
    tag: 'Trending',
  },
  {
    id: 7,
    name: 'Summer Dress',
    price: 34.99,
    originalPrice: 49.99,
    image: '/images/logo.png',
    rating: 4.8,
    reviews: 89,
    discount: 30,
    tag: 'New',
  },
  {
    id: 8,
    name: 'Sunglasses',
    price: 19.99,
    originalPrice: 29.99,
    image: '/images/logo.png',
    rating: 4.6,
    reviews: 67,
    discount: 33,
    tag: 'Trending',
  },
]

export default function HomePage() {
  const { addToCart } = useCart()
  const [addingId, setAddingId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const handleAddToCart = async (productId: number, productName: string) => {
    setAddingId(productId)
    try {
      await addToCart(productId.toString())
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="text-center text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
              ស្វាគមន៍មកកាន់ Petal of Praise
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-2">
              ហាងលក់ផ្កា
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-sm sm:text-base"
            >
              ទិញឥឡូវនេះ
              <span className="text-lg sm:text-xl">→</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Flash Sale Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-red-500 py-2 sm:py-3">
        <div className="animate-pulse">
          <div className="flex items-center justify-center gap-1 sm:gap-2 px-2">
            <span className="text-yellow-300 animate-bounce text-sm sm:text-base">⚡</span>
            <p className="text-white text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-center">
              FLASH SALE! បញ្ចុះតម្លៃរហូតដល់ 50% + ដឹកជញ្ជូនឥតគិតថ្លៃ
            </p>
            <span className="text-yellow-300 animate-bounce text-sm sm:text-base">⚡</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Truck, label: 'ដឹកជញ្ជូនឥតគិតថ្លៃ', desc: 'សម្រាប់ការបញ្ជាទិញលើសពី 50$' },
              { icon: ShieldCheck, label: 'ធានាគុណភាព', desc: 'ត្រឡប់ប្រាក់វិញ 100%' },
              { icon: RefreshCw, label: 'ប្តូរដោយឥតគិតថ្លៃ', desc: 'ក្នុងរយៈពេល 7ថ្ងៃ' },
              { icon: Clock, label: 'ដឹកជញ្ជូនលឿន', desc: 'ទទួលបានក្នុងរយៈពេល 24-48ម៉ោង' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-blue-200 transition-all group-hover:scale-110">
                  <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-xs sm:text-base mb-1">{feature.label}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products - Same grid as Products page */}
      <div className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">✨ ផលិតផលពេញនិយម</h2>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base">ផលិតផលដែលអតិថិជនចូលចិត្តបំផុត</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-xs sm:text-sm md:text-base">
              មើលទាំងអស់
              <span className="text-base sm:text-xl">→</span>
            </Link>
          </div>

          {/* Same grid as Products page: 2 columns on mobile, 5 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Tag Badge */}
                {product.tag && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-full">
                    {product.tag}
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button className="absolute bottom-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Product Image - Same aspect-square as Products page */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
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
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[6px] sm:text-[8px] text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                    <span className="text-[10px] sm:text-sm font-bold text-blue-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[6px] sm:text-[8px] text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product.id, product.name)}
                    disabled={addingId === product.id}
                    className="w-full bg-gray-100 text-gray-800 py-1 sm:py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-0.5 sm:gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingId === product.id ? (
                      <svg className="animate-spin w-2 h-2 sm:w-2.5 sm:h-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    )}
                    <span className="text-[8px] sm:text-[10px] font-medium">
                      {addingId === product.id ? 'កំពុងបន្ថែម...' : 'បន្ថែម'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-10 sm:py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">📧 ទទួលបានព័ត៌មានថ្មីៗ</h2>
          <p className="text-blue-100 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 px-2">ចុះឈ្មោះទទួលបានកូដបញ្ចុះតម្លៃ 15% សម្រាប់ការទិញលើកដំបូង</p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3 px-4 sm:px-0">
            <input
              type="email"
              placeholder="អាសយដ្ឋានអ៊ីមែល"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full border-0 focus:ring-2 focus:ring-white focus:outline-none text-sm sm:text-base"
            />
            <button className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base">
              ចុះឈ្មោះ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}