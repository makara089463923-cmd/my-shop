import Slideshow from '@/components/ui/Slideshow'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, Clock, RefreshCw, Eye } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/images/slide-1.jpg',
    title: '🎒 Summer Collection 2025',
    description: 'កាបូបស្ពាយ និងសម្លៀកបំពាក់ទាន់សម័យ',
    buttonText: 'Shop Now',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: '/images/slide-2.jpg',
    title: '👕 Up to 30% Off',
    description: 'អាវយឺតគុណភាពខ្ពស់ តម្លៃពិសេស',
    buttonText: 'Shop Now',
    buttonLink: '/products',
  },
  {
    id: 3,
    image: '/images/slide-3.jpg',
    title: '🧢 Accessories Sale',
    description: 'មួក និងគ្រឿងបន្លាស់សម្រាប់គ្រប់រចនាប័ទ្ម',
    buttonText: 'Shop Now',
    buttonLink: '/products',
  },
]

const featuredProducts = [
  {
    id: 1,
    name: 'Multi Pocket School Backpack',
    price: 49.59,
    originalPrice: 59.99,
    image: '/images/backpack.jpg',
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
]

const categories = [
  { name: 'កាបូបស្ពាយ', icon: '🎒', color: 'from-blue-500 to-indigo-500', href: '/products?category=backpack', count: 24 },
  { name: 'អាវយឺត', icon: '👕', color: 'from-green-500 to-teal-500', href: '/products?category=tshirt', count: 45 },
  { name: 'មួក', icon: '🧢', color: 'from-orange-500 to-red-500', href: '/products?category=cap', count: 18 },
  { name: 'ស្បែកជើង', icon: '👟', color: 'from-purple-500 to-pink-500', href: '/products?category=shoes', count: 32 },
  { name: 'អាវយឺតកវែង', icon: '👔', color: 'from-cyan-500 to-blue-500', href: '/products?category=shirt', count: 28 },
  { name: 'សម្លៀកបំពាក់កីឡា', icon: '⚽', color: 'from-red-500 to-orange-500', href: '/products?category=sports', count: 22 },
]

const testimonials = [
  {
    id: 1,
    name: 'សុខា ម៉ៅ',
    avatar: '/avatars/1.jpg',
    rating: 5,
    comment: 'កាបូបស្អាតណាស់ គុណភាពល្អ តម្លៃសមរម្យ ស្របតាមរូបភាព',
    date: '2024-03-15',
  },
  {
    id: 2,
    name: 'ដាលី ថោង',
    avatar: '/avatars/2.jpg',
    rating: 5,
    comment: 'បានទិញអាវយឺត ៣ដុំ គុណភាពល្អណាស់ ដឹកជញ្ជូនលឿន',
    date: '2024-03-10',
  },
  {
    id: 3,
    name: 'ពិសី សុខ',
    avatar: '/avatars/3.jpg',
    rating: 4,
    comment: 'មួកស្អាត ពាក់កក់ក្ដៅ តម្លៃសមរម្យ ស្រួលបញ្ជា',
    date: '2024-03-05',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Slideshow - with smaller height */}
      <div className="h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
        <Slideshow slides={slides} autoPlay={true} interval={5000} />
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
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-all 
group-hover:scale-110">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.label}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale Countdown */}
      <div className="py-8 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <h2 className="text-2xl font-bold text-white">Flash Sale</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">កំពុងប្រព្រឹត្តទៅ</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">03</span>
                  <span className="text-white text-sm ml-1">ថ្ងៃ</span>
                </div>
              </div>
              <span className="text-white text-2xl">:</span>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">12</span>
                  <span className="text-white text-sm ml-1">ម៉ោង</span>
                </div>
              </div>
              <span className="text-white text-2xl">:</span>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">45</span>
                  <span className="text-white text-sm ml-1">នាទី</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              ជ្រើសរើសប្រភេទសម្លៀកបំពាក់
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-4">ស្វែងរកសម្លៀកបំពាក់ដែលអ្នកស្រលាញ់</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{cat.name}</h3>
                <p className="text-white/80 text-xs">{cat.count} ផលិតផល</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale Products */}
      <div className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">⚡ Flash Sale ⚡</h2>
              <p className="text-gray-500">កុំខកខានឱកាសល្អៗ</p>
            </div>
            <Link href="/products" className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1">
              មើលទាំងអស់
              <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Tag Badge */}
                {product.tag && (
                  <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.tag}
                  </div>
                )}
                
                {/* Wishlist Button */}
                <button className="absolute bottom-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-500 transition line-clamp-1">
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
                    <span className="text-2xl font-bold text-red-500">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center 
justify-center gap-2 group">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">បន្ថែមទៅកន្ត្រក</span>
                  </button>
                </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center 
justify-center gap-2 group">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">បន្ថែមទៅកន្ត្រក</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">💬 មតិពីអតិថិជន</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  "{testimonial.comment}"
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(testimonial.date).toLocaleDateString('km-KH')}
                </p>
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
