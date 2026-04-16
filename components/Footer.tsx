'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <span className="text-2xl">🛍️</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ​Petal of Praise
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
            ហាងលក់ផ្កា
            </p>
            <div className="flex gap-3 justify-center sm:justify-start mt-4">
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.578-11.987c0-.213-.005-.426-.015-.637.754-.545 1.414-1.22 1.952-1.995z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">តំណភ្ជាប់</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-500 hover:text-blue-600 transition text-sm flex items-center justify-center sm:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 transition-all"></span>
                  ផលិតផលទាំងអស់
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-blue-600 transition text-sm flex items-center justify-center sm:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 transition-all"></span>
                  អំពីយើង
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-blue-600 transition text-sm flex items-center justify-center sm:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 transition-all"></span>
                  ទំនាក់ទំនង
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-500 hover:text-blue-600 transition text-sm flex items-center justify-center sm:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 transition-all"></span>
                  តាមដានការបញ្ជា
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">សេវាកម្ម</h3>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">ប្តូរទំនិញ 7ថ្ងៃ</li>
              <li className="text-gray-500 text-sm">ធានាគុណភាព 100%</li>
              <li className="text-gray-500 text-sm">ដឹកជញ្ជូនលឿន</li>
              <li className="text-gray-500 text-sm">បង់ប្រាក់តាមការចូលចិត្ត</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ទំនាក់ទំនង</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start gap-3 text-gray-500 text-sm">
                <span className="text-blue-500 text-lg">📍</span>
                <span>ភ្នំពេញ, កម្ពុជា</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-3 text-gray-500 text-sm">
                <span className="text-blue-500 text-lg">📞</span>
                <span>081 615512</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-3 text-gray-500 text-sm">
                <span className="text-blue-500 text-lg">✉️</span>
                <span>info@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Delivery Banner */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span className="text-gray-700 font-medium">បញ្ជាទិញលើសពី 50$ ដឹកជញ្ជូនឥតគិតថ្លៃ!</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <span className="text-gray-600 text-sm">ទទួលយកការបង់ប្រាក់តាម ABA, Wing, TrueMoney</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} ​Petal of Praise. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-gray-400 text-xs hover:text-blue-500 cursor-pointer transition">គោលការណ៍ភាពឯកជន</span>
              <span className="text-gray-400 text-xs hover:text-blue-500 cursor-pointer transition">លក្ខខណ្ឌប្រើប្រាស់</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}