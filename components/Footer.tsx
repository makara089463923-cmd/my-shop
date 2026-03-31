'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Main Footer Grid - Mobile: 3 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
          
          {/* About Section - Span 2 on mobile? No, keep simple */}
          <div className="col-span-3 md:col-span-1 text-center md:text-left">
            <h3 className="text-sm md:text-lg font-bold mb-3 md:mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>🌸</span> 
              <span className="text-xs md:text-base">Petal of Praise</span>
            </h3>
            <p className="text-gray-400 text-[11px] md:text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              ហាងលក់ផ្កាស្រស់ៗ នាំចូលពីប្រទេសហូឡង់
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xs md:text-lg font-bold mb-2 md:mb-4">តំណភ្ជាប់</h3>
            <ul className="space-y-1 md:space-y-2 text-[11px] md:text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-pink-400 transition inline-flex items-center gap-1">
                  <span className="text-xs">🌸</span> ផ្កាយើង
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-pink-400 transition inline-flex items-center gap-1">
                  <span className="text-xs">🔍</span> តាមដាន
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-pink-400 transition inline-flex items-center gap-1">
                  <span className="text-xs">📞</span> ទំនាក់ទំនង
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-xs md:text-lg font-bold mb-2 md:mb-4">តាមដាន</h3>
            <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition text-xl md:text-2xl">
                📘
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition text-xl md:text-2xl">
                📷
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition text-xl md:text-2xl">
                📨
              </a>
            </div>
          </div>
          
          {/* Contact Info (Hidden on mobile, shown in bottom section) */}
          <div className="hidden md:block text-left">
            <h3 className="text-lg font-bold mb-4">ទំនាក់ទំនង</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📍</span> ភ្នំពេញ, កម្ពុជា
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> 081 615512
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> info@petalofpraise.com
              </li>
            </ul>
          </div>
        </div>
        
        {/* Contact Info Section - Mobile only (3 columns like Contact page) */}
        <div className="mt-6 pt-4 border-t border-gray-800 md:hidden">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xl mb-1">📍</div>
              <p className="text-[10px] text-gray-400">អាសយដ្ឋាន</p>
              <p className="text-[11px] font-medium text-gray-300">ភ្នំពេញ</p>
            </div>
            <div>
              <div className="text-xl mb-1">📞</div>
              <p className="text-[10px] text-gray-400">ទូរស័ព្ទ</p>
              <p className="text-[11px] font-medium text-gray-300">081 615512</p>
            </div>
            <div>
              <div className="text-xl mb-1">✉️</div>
              <p className="text-[10px] text-gray-400">អ៊ីមែល</p>
              <p className="text-[11px] font-medium text-gray-300">info@...</p>
            </div>
          </div>
        </div>
        
        {/* Delivery Banner */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-gray-400 text-xs text-center">
            🚚 បញ្ជាទិញលើសពី 50$ ដឹកជញ្ជូនឥតគិតថ្លៃ
          </p>
        </div>
        
        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-gray-500 text-[10px] md:text-xs">
          <p>&copy; {new Date().getFullYear()} Petal of Praise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
