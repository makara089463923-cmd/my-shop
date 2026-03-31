'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useNotifications } from '@/context/NotificationContext'  // បន្ថែមនេះ
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()
  const { orderCount, wishlistCount } = useNotifications()  // បន្ថែមនេះ
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* Logo and Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition">
              <Image
                src="/images/logo.png"
                alt="Gain of Gratitude"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-base md:text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Petal of Praise
              </span>
              <p className="text-[10px] md:text-xs text-gray-400 -mt-1">Here With Me</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ស្វែងរកផ្កា..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 
focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs 
hover:bg-pink-600"
              >
                ស្វែងរក
              </button>
            </div>
          </form>
        </div>

        {/* Menu Links */}
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex flex-wrap gap-2 sm:gap-4 min-w-max">
            <Link href="/" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1">
              🏠 Home
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1">
              🌸 Products
            </Link>
            
            {/* Wishlist with Badge */}
            <Link href="/wishlist" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1 
relative">
              💖 Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center 
justify-center font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart with Badge */}
            <Link href="/cart" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1 relative">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center 
justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            
            {/* Orders with Badge */}
            <Link href="/orders" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1 relative">
              📋 Orders
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center 
justify-center font-bold">
                  {orderCount > 99 ? '99+' : orderCount}
                </span>
              )}
            </Link>
            
            <Link href="/track" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1">
              📦 Track
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1">
              📧 Contact
            </Link>
            
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-pink-600 hover:text-pink-700 transition font-medium whitespace-nowrap px-2 py-1">
                👑 Admin
              </Link>
            )}
            
            {session ? (
              <>
                <span className="text-gray-500 whitespace-nowrap px-2 py-1">
                  👤 {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-500 hover:text-red-600 transition font-medium whitespace-nowrap px-2 py-1"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-pink-600 transition font-medium whitespace-nowrap px-2 py-1">
                  🔑 Login
                </Link>
                <Link href="/register" className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition text-sm 
whitespace-nowrap">
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
