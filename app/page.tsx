import Slideshow from '@/components/ui/Slideshow'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    image: '/images/slide-1.jpg',
    title: '🌸 ផ្កាស្រស់ៗ រាល់ថ្ងៃ',
    description: 'ផ្កាដែលបាននាំចូលពីប្រទេសហូឡង់ ធានាគុណភាព 100%',
    buttonText: 'ទិញឥឡូវ',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: '/images/slide-2.jpg',
    title: '🎁 ភួងផ្កាតាមការបញ្ជា',
    description: 'រចនាភួងផ្កាតាមចំណូលចិត្តរបស់អ្នក',
    buttonText: 'បញ្ជាទិញ',
    buttonLink: '/products',
  },
  {
    id: 3,
    image: '/images/slide-3.jpg',
    title: '💝 ផ្កាសម្រាប់ថ្ងៃពិសេស',
    description: 'បញ្ជាទិញមុន 24 ម៉ោង ទទួលការបញ្ចុះតម្លៃ 20%',
    buttonText: 'ស្វែងយល់បន្ថែម',
    buttonLink: '/products',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Slideshow */}
      <Slideshow slides={slides} autoPlay={true} interval={5000} />

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-center">
        <p className="text-white text-sm font-medium">
          ⚡ បញ្ជាទិញមុន 24 ម៉ោង ទទួលបានការបញ្ចុះតម្លៃ 20% ⚡
        </p>
      </div>

      {/* Features - 4 icons row */}
      <div className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-2xl mb-1">🚚</div>
              <p className="text-[10px] sm:text-xs text-gray-500">ដឹកជញ្ជូនឥតគិតថ្លៃ</p>
            </div>
            <div>
              <div className="text-2xl mb-1">💎</div>
              <p className="text-[10px] sm:text-xs text-gray-500">ផ្កាស្រស់ថ្មី</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🎁</div>
              <p className="text-[10px] sm:text-xs text-gray-500">វេចខ្ចប់ស្អាត</p>
            </div>
            <div>
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-[10px] sm:text-xs text-gray-500">ដឹកជញ្ជូនលឿន</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories - 2x2 grid on mobile, 4 on desktop */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ជ្រើសរើសប្រភេទផ្កា</h2>
            <p className="text-gray-400 text-sm mt-1">ផ្កាស្រស់ៗ សម្រាប់អ្នកពិសេស</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'កុលាប', icon: '🌹', color: 'bg-red-500', href: '/products?category=ផ្កាកុលាប' },
              { name: 'ឈូក', icon: '🌸', color: 'bg-pink-500', href: '/products?category=ផ្កាឈូក' },
              { name: 'ម្លិះ', icon: '🤍', color: 'bg-gray-400', href: '/products?category=ផ្កាម្លិះ' },
              { name: 'ភួង', icon: '💐', color: 'bg-purple-500', href: '/products?category=ភួង' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`${cat.color} rounded-2xl p-5 text-center hover:scale-105 transition transform shadow-md`}
              >
                <div className="text-4xl sm:text-5xl mb-2">{cat.icon}</div>
                <h3 className="text-white font-semibold text-base sm:text-lg">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products - Simple banner */}
      <div className="bg-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">✨ ផ្កាពេញនិយម</h2>
              <p className="text-gray-500 text-sm mb-4">មើលផ្កាដែលអតិថិជនចូលចិត្ត</p>
              <Link href="/products" className="inline-block bg-pink-500 text-white px-6 py-2 rounded-full text-sm hover:bg-pink-600 
transition">
                ទិញឥឡូវ →
              </Link>
            </div>
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">🌹</div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">🌸</div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">💐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact - Simple footer bar */}
      <div className="py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-center">
            <a href="tel:+85512345678" className="text-gray-500 hover:text-pink-500 text-sm">📞 +855 12 345 678</a>
            <a href="mailto:info@myshop.com" className="text-gray-500 hover:text-pink-500 text-sm">✉️ info@myshop.com</a>
            <span className="text-gray-500 text-sm">📍 ភ្នំពេញ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
