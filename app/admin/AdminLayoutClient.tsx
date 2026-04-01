'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  
  const adminMenuItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/products', icon: '📦', label: 'Products' },
    { href: '/admin/orders', icon: '🛒', label: 'Orders' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/contacts', icon: '📧', label: 'Contacts' },
  ]

  const isActive = (href: string) => pathname === href

  // Check if mobile on client side only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when pressing ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('adminSidebarOpen')
      if (savedState !== null) {
        setSidebarOpen(savedState === 'true')
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('adminSidebarOpen', String(sidebarOpen))
    }
  }, [sidebarOpen, isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800">🛡️ Admin Panel</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-50
          transition-all duration-300 ease-in-out
          shadow-xl overflow-y-auto
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'}
          overflow-x-hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              {sidebarOpen ? (
                <h2 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent whitespace-nowrap">
                  🛡️ Admin Panel
                </h2>
              ) : (
                <span className="text-xl font-bold text-pink-400">🛡️</span>
              )}
              <button 
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300 text-xl focus:outline-none"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
            </div>
            
            <nav className="flex flex-col gap-1 flex-1">
              {/* Admin Section */}
              {sidebarOpen && (
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-2">Menu</div>
              )}
              {adminMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false)
                  }}
                  className={`
                    px-3 py-2.5 rounded-lg transition flex items-center gap-3 text-sm
                    ${isActive(item.href) 
                      ? 'bg-pink-500 text-white shadow-md' 
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </Link>
              ))}
              
              <hr className="border-gray-700 my-2"/>
              
              {/* User Info & Logout */}
              {sidebarOpen ? (
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-3 text-gray-400 mb-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">MAKARA</p>
                      <p className="text-xs text-gray-400">Admin</p>
                    </div>
                  </div>
                  <Link
                    href="/api/auth/signout"
                    className="px-3 py-2 rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300 flex items-center gap-3 text-sm"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Logout</span>
                  </Link>
                </div>
              ) : (
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-base">
                      👤
                    </div>
                  </div>
                  <Link
                    href="/api/auth/signout"
                    className="flex justify-center px-2 py-2 rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300"
                    title="Logout"
                  >
                    <span className="text-xl">🚪</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {typeof window !== 'undefined' && sidebarOpen && window.innerWidth < 1024 && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}
        
        {/* Main Content */}
        <main className={`
          flex-1 min-w-0 w-full transition-all duration-300
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}
        `}>
          {/* Desktop Toggle Button */}
          <div className="hidden lg:block sticky top-4 left-4 z-20">
            <button
              onClick={toggleSidebar}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition border border-gray-200"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>
          
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
