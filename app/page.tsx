import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Clock, RefreshCw, Eye } from 'lucide-react'

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
    image: '/images/cap.jpg',
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
    image: '/images/tshirt.jpg',
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
    image: '/images/hoodie.jpg',
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
    image: '/images/shoes.jpg',
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
    image: '/images/jeans.jpg',
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
    image: '/images/dress.jpg',
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
    image: '/images/sunglasses.jpg',
    rating: 4.6,
    reviews: 67,
    discount: 33,
    tag: 'Trending',
  },
]

const categories = [
  { name: 'កាបូបស្ពាយ', icon: '🎒', color: 'from-blue-500 to-indigo-500', href: '/products?category=backpack', count: 24 },
  { name: 'អាវយឺត', icon: '👕', color: 'from-green-500 to-teal-500', href: '/products?category=tshirt', count: 45 },
  { name: 'មួក', icon: '🧢', color: 'from-orange-500 to-red-500', href: '/products?category=cap', count: 18 },
  { name: 'ស្បែកជើង', icon: '👟', color: 'from-purple-500 to-pink-500', href: '/products?category=shoes', count: 32 },
  { name: 'អាវវែង', icon: '👔', color: 'from-cyan-500 to-blue-500', href: '/products?category=shirt', count: 28 },
  { name: 'កីឡា', icon: '⚽', color: 'from-red-500 to-orange-500', href: '/products?category=sports', count: 22 },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              ស្វាគមន៍មកកាន់ Petal of Praise
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              ហាងលក់ផ្កា
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              ទិញឥឡូវនេះ
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Flash Sale Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-red-500 py-3">
        <div className="animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-300 animate-bounce">⚡</span>
            <p className="text-white text-sm font-semibold tracking-wide">
              FLASH SALE! បញ្ចុះតម្លៃរហូតដល់ 50% + ដឹកជញ្ជូនឥតគិតថ្លៃ
            </p>
            <span className="text-yellow-300 animate-bounce">⚡</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'ដឹកជញ្ជូនឥតគិតថ្លៃ', desc: 'សម្រាប់ការបញ្ជាទិញលើសពី 50$' },
              { icon: ShieldCheck, label: 'ធានាគុណភាព', desc: 'ត្រឡប់ប្រាក់វិញ 100%' },
              { icon: RefreshCw, label: 'ប្តូរដោយឥតគិតថ្លៃ', desc: 'ក្នុងរយៈពេល 7ថ្ងៃ' },
              { icon: Clock, label: 'ដឹកជញ្ជូនលឿន', desc: 'ទទួលបានក្នុងរយៈពេល 24-48ម៉ោង' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-all group-hover:scale-110">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.label}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
     

      {/* Featured Products */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">✨ ផលិតផលពេញនិយម</h2>
              <p className="text-gray-500">សម្លៀកបំពាក់ដែលអតិថិជនចូលចិត្តបំផុត</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              មើលទាំងអស់
              <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Quick View Button */}
                <button className="absolute bottom-3 left-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all">
                  <Eye className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">បន្ថែមទៅកន្ត្រក</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">📧 ទទួលបានព័ត៌មានថ្មីៗ</h2>
          <p className="text-blue-100 mb-6">ចុះឈ្មោះទទួលបានកូដបញ្ចុះតម្លៃ 15% សម្រាប់ការទិញលើកដំបូង</p>
          
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="អាសយដ្ឋានអ៊ីមែល"
              className="flex-1 px-4 py-3 rounded-full border-0 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              ចុះឈ្មោះ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}