'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
      setMenuOpen(false)
    }
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-pink-600 whitespace-nowrap">
            🌸 MyShop
          </Link>
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ស្វែងរកផ្កា..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 
focus:ring-pink-500 focus:border-transparent text-sm"
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/products" className="text-gray-600 hover:text-pink-600 transition font-medium">
              Products
            </Link>
            <Link href="/wishlist" className="text-gray-600 hover:text-pink-600 transition font-medium">
              💖 Wishlist
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-pink-600 transition font-medium relative">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center 
justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-pink-600 transition font-medium">
              📋 Orders
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition font-medium">
              📧 Contact
            </Link>
<Link href="/track" className="text-gray-600 hover:text-pink-600 transition font-medium">
  📦 Track
</Link>
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-600 hover:text-pink-600 transition text-sm">
                    👑 Admin
                  </Link>
                )}
<a href="/profile" className="text-gray-500 text-sm hover:text-pink-600 transition">
  {session.user?.name}
</a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-gray-600 hover:text-pink-600 transition text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 transition text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ស្វែងរកផ្កា..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 
focus:ring-pink-500 focus:border-transparent text-sm"
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t mt-3 pt-3 flex flex-col gap-2">
            <Link href="/products" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/wishlist" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
              💖 Wishlist
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-pink-600 py-1 flex items-center gap-2" onClick={() => 
setMenuOpen(false)}>
              🛒 Cart
              {cartCount > 0 && (
                <span className="bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
              📋 Orders
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
              📧 Contact
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
                👑 Admin
              </Link>
            )}
            {session ? (
              <>
                <span className="text-gray-500 text-sm py-1">{session.user?.name}</span>
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-pink-600 py-1" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition text-sm 
text-center" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
