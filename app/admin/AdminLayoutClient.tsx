'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  const menuItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/products', icon: '📦', label: 'Products' },
    { href: '/admin/orders', icon: '🛒', label: 'Orders' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/contacts', icon: '📧', label: 'Contacts' },
  ]

  const isActive = (href: string) => pathname === href

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    setSidebarOpen(false)
  }

  // Close sidebar when pressing ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header - Always visible on mobile */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">🛡️ Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden on mobile by default, shows when sidebarOpen is true */}
        <aside className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-50
          transition-transform duration-300 ease-in-out
          w-64 shadow-xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}>
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">🛡️ Admin Panel</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300 text-2xl focus:outline-none"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    px-4 py-2.5 rounded-lg transition flex items-center gap-3
                    ${isActive(item.href) 
                      ? 'bg-pink-500 text-white' 
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              
              <hr className="border-gray-700 my-2"/>
              
              <Link
                href="/"
                onClick={handleLinkClick}
                className="px-4 py-2.5 rounded-lg hover:bg-gray-700 transition text-gray-400 hover:text-white flex items-center gap-3"
              >
                <span className="text-xl">←</span>
                <span className="text-sm font-medium">ត្រឡប់ Shop</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Overlay - Shows when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full">
          <div className="p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
