'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useNotifications } from '@/context/NotificationContext'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()
  const { orderCount, wishlistCount } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  // Menu items
  const menuItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/products', icon: '🌸', label: 'Products' },
    { href: '/wishlist', icon: '💖', label: 'Wishlist', badge: wishlistCount, badgeColor: 'pink' },
    { href: '/cart', icon: '🛒', label: 'Cart', badge: cartCount, badgeColor: 'pink' },
    { href: '/orders', icon: '📋', label: 'Orders', badge: orderCount, badgeColor: 'green' },
    { href: '/track', icon: '📦', label: 'Track' },
    { href: '/contact', icon: '📧', label: 'Contact' },
  ]

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* Logo and Search Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hidden sm:block">
              Petal of Praise
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ស្វែងរកផ្កា..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs">
                ស្វែងរក
              </button>
            </div>
          </form>

          {/* Mobile: Hamburger Menu + Search Icon */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Search Icon for Mobile */}
            <button
              onClick={() => {
                const searchInput = document.getElementById('mobile-search')
                if (searchInput) searchInput.classList.toggle('hidden')
              }}
              className="p-2 text-gray-600"
            >
              🔍
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Desktop: Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-pink-600 text-sm font-medium">👑 Admin</Link>
            )}
            
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 text-gray-600 hover:text-pink-600 text-sm font-medium"
                >
                  👤 {session.user?.name}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link href="/settings" className="block px-3 py-2 text-sm hover:bg-pink-50" onClick={() => setShowSettings(false)}>
                      ⚙️ ការកំណត់
                    </Link>
                    <button onClick={() => { signOut({ callbackUrl: '/' }); setShowSettings(false) }} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 text-sm font-medium">🔑 Login</Link>
                <Link href="/register" className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">📝 Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div id="mobile-search" className="hidden sm:hidden mt-3">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ស្វែងរកផ្កា..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs">
                ស្វែងរក
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Menu - All items in row */}
        <div className="hidden sm:block mt-4 overflow-x-auto pb-2">
          <div className="flex flex-wrap gap-3 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-pink-600 text-sm font-medium whitespace-nowrap relative"
              >
                {item.icon} {item.label}
                {item.badge > 0 && (
                  <span className={`absolute -top-2 -right-3 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center ${item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'}`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu - Hamburger */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-pink-600 py-2 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span> {item.label}
                  {item.badge > 0 && (
                    <span className={`text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ${item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'}`}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-pink-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  👑 Admin
                </Link>
              )}
              
              {session ? (
                <>
                  <Link href="/settings" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                    ⚙️ ការកំណត់
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false) }}
                    className="text-red-500 text-left py-2"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                    🔑 Login
                  </Link>
                  <Link href="/register" className="bg-pink-500 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                    📝 Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
