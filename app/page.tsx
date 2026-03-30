import Slideshow from '@/components/ui/Slideshow'
import Link from 'next/link'

// Slides data
const slides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg',
    title: '🌸 ផ្កាស្រស់ៗ រាល់ថ្ងៃ',
    description: 'ផ្កាដែលបាននាំចូលពីប្រទេសហូឡង់ ធានាគុណភាព 100%',
    buttonText: 'ទិញឥឡូវ',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1309638/pexels-photo-1309638.jpeg',
    title: '🎁 ភួងផ្កាតាមការបញ្ជា',
    description: 'រចនាភួងផ្កាតាមចំណូលចិត្តរបស់អ្នក',
    buttonText: 'បញ្ជាទិញ',
    buttonLink: '/products',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2804745/pexels-photo-2804745.jpeg',
    title: '💝 ផ្កាសម្រាប់ថ្ងៃពិសេស',
    description: 'បញ្ជាទិញមុន 24 ម៉ោង ទទួលការបញ្ចុះតម្លៃ 20%',
    buttonText: 'ស្វែងយល់បន្ថែម',
    buttonLink: '/products',
  },
]

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Slideshow */}
      <Slideshow slides={slides} autoPlay={true} interval={5000} />

      {/* Shop Info Section */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🌸 អំពីហាងយើង</h2>
            <p className="text-gray-500 text-sm">សូមស្វាគមន៍មកកាន់ហាងផ្កា MyShop</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-2">📍</div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">អាសយដ្ឋាន</h3>
              <p className="text-gray-500 text-xs">
                ផ្ទះលេខ 123, ផ្លូវព្រះមុនីវង្ស,<br />
                សង្កាត់បឹងកេងកងទី១,<br />
                រាជធានីភ្នំពេញ
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-2">📞</div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">ទំនាក់ទំនង</h3>
              <p className="text-gray-500 text-xs">
                📱 012 345 678<br />
                📨 Telegram: @myshop_kh<br />
                💬 WhatsApp: 012 345 678
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">ម៉ោងបើក</h3>
              <p className="text-gray-500 text-xs">
                ច័ន្ទ - សុក្រ: 8:00 - 20:00<br />
                សៅរ៍ - អាទិត្យ: 9:00 - 18:00
              </p>
            </div>
          </div>

          {/* Social Media & Delivery Banner */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-500 rounded-2xl p-4 text-center">
              <p className="text-white text-sm font-medium">
                🚚 បញ្ជាទិញលើសពី 50$ ដឹកជញ្ជូនឥតគិតថ្លៃ!
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <div className="flex justify-center gap-4">
                <Link href="https://facebook.com" target="_blank" className="text-blue-600 hover:text-blue-700 text-xl">
                  📘 Facebook
                </Link>
                <Link href="https://t.me" target="_blank" className="text-blue-500 hover:text-blue-600 text-xl">
                  📨 Telegram
                </Link>
                <Link href="https://instagram.com" target="_blank" className="text-pink-500 hover:text-pink-600 text-xl">
                  📷 Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
