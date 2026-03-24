'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          🛍️ MyShop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-blue-600 transition font-medium">
            Products
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition font-medium">
            🛒 Cart
          </Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm">
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          <Link href="/products" className="text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>
            🛒 Cart
          </Link>
          {session ? (
            <>
              <span className="text-gray-500 text-sm">{session.user?.name}</span>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm text-center" onClick={() => 
setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
