// 'use client'
// import Link from 'next/link'
// import { useSession, signOut } from 'next-auth/react'
// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useCart } from '@/context/CartContext'
// import { useNotifications } from '@/context/NotificationContext'
// import Image from 'next/image'
// import { Search, ShoppingCart, Heart, Home, Package, ClipboardList, Truck, Mail, Settings, LogOut, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react'

// export default function Navbar() {
//   const { data: session } = useSession()
//   const { cartCount } = useCart()
//   const { orderCount, wishlistCount } = useNotifications()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showSettings, setShowSettings] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowSettings(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchTerm.trim()) {
//       router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
//       setSearchTerm('')
//       setMobileSearchOpen(false)
//     }
//   }

//   // Menu items
//   const menuItems = [
//     { href: '/', icon: Home, label: 'ទំព័រដើម' },
//     { href: '/products', icon: Package, label: 'ផលិតផល' },
//     { href: '/wishlist', icon: Heart, label: 'សំណព្វចិត្ត', badge: wishlistCount, badgeColor: 'pink' },
//     { href: '/cart', icon: ShoppingCart, label: 'កន្ត្រក', badge: cartCount, badgeColor: 'pink' },
//     { href: '/orders', icon: ClipboardList, label: 'ការបញ្ជា', badge: orderCount, badgeColor: 'green' },
//     { href: '/track', icon: Truck, label: 'តាមដាន' },
//     { href: '/contact', icon: Mail, label: 'ទំនាក់ទំនង' },
//   ]

//   return (
//     <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Main Navbar Row */}
//         <div className="flex items-center justify-between h-16 gap-4">
          
//           {/* Logo Section */}
//           <Link href="/" className="flex items-center gap-2 shrink-0 group">
//             <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-shadow">
//               <Image
//                 src="/images/logo.png"
//                 alt="Logo"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//             <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
//             ​Petal of Praise
//             </span>
//           </Link>

//           {/* Desktop Search Bar */}
//           <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="ស្វែងរកផលិតផល..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-20 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition"
//               />
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition">
//                 ស្វែងរក
//               </button>
//             </div>
//           </form>

//           {/* Mobile Actions */}
//           <div className="flex items-center gap-1 md:hidden">
//             {/* Search Icon for Mobile */}
//             <button
//               onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//               className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Search className="w-5 h-5" />
//             </button>
//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
//             >
//               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             {session?.user?.role === 'ADMIN' && (
//               <Link href="/admin" className="text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
//                 👑 Admin
//               </Link>
//             )}
            
//             {session ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setShowSettings(!showSettings)}
//                   className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
//                 >
//                   <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
//                     {session.user?.name?.charAt(0) || 'U'}
//                   </div>
//                   <span className="max-w-[100px] truncate">{session.user?.name}</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
//                 </button>
                
//                 {showSettings && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
//                     <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition" onClick={() => setShowSettings(false)}>
//                       <Settings className="w-4 h-4" />
//                       ការកំណត់
//                     </Link>
//                     <button onClick={() => { signOut({ callbackUrl: '/' }); setShowSettings(false) }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full">
//                       <LogOut className="w-4 h-4" />
//                       ចាកចេញ
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
//                   <LogIn className="w-4 h-4" />
//                   ចូល
//                 </Link>
//                 <Link href="/register" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
//                   <UserPlus className="w-4 h-4" />
//                   ចុះឈ្មោះ
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         {mobileSearchOpen && (
//           <div className="md:hidden py-3 border-t border-gray-100">
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="ស្វែងរកផលិតផល..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-20 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
//                   autoFocus
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
//                   ស្វែងរក
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Desktop Navigation Menu */}
//         <div className="hidden md:block mt-0 pt-3 pb-2 border-t border-gray-100">
//           <div className="flex flex-wrap gap-1">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition relative"
//               >
//                 <item.icon className="w-4 h-4" />
//                 {item.label}
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <span className={`absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
//                     item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'
//                   }`}>
//                     {item.badge > 99 ? '99+' : item.badge}
//                   </span>
//                 )}
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 border-t border-gray-100">
//             <div className="flex flex-col gap-1">
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="flex items-center gap-3 text-gray-600 hover:text-blue-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="flex-1">{item.label}</span>
//                   {item.badge !== undefined && item.badge > 0 && (
//                     <span className={`text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ${
//                       item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'
//                     }`}>
//                       {item.badge > 99 ? '99+' : item.badge}
//                     </span>
//                   )}
//                 </Link>
//               ))}
              
//               {session?.user?.role === 'ADMIN' && (
//                 <Link href="/admin" className="flex items-center gap-3 text-blue-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition" onClick={() => setMobileMenuOpen(false)}>
//                   <span className="text-xl">👑</span>
//                   Admin
//                 </Link>
//               )}
              
//               {session ? (
//                 <>
//                   <Link href="/settings" className="flex items-center gap-3 text-gray-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition" onClick={() => setMobileMenuOpen(false)}>
//                     <Settings className="w-5 h-5" />
//                     ការកំណត់
//                   </Link>
//                   <button
//                     onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false) }}
//                     className="flex items-center gap-3 text-red-600 py-3 px-2 rounded-lg hover:bg-red-50 transition w-full"
//                   >
//                     <LogOut className="w-5 h-5" />
//                     ចាកចេញ
//                   </button>
//                 </>
//               ) : (
//                 <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-gray-100">
//                   <Link href="/login" className="flex items-center justify-center gap-2 text-gray-600 py-2 px-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>
//                     <LogIn className="w-4 h-4" />
//                     ចូល
//                   </Link>
//                   <Link href="/register" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition" onClick={() => setMobileMenuOpen(false)}>
//                     <UserPlus className="w-4 h-4" />
//                     ចុះឈ្មោះ
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }





'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useNotifications } from '@/context/NotificationContext'
import Image from 'next/image'
import { Search, ShoppingCart, Heart, Home, Package, ClipboardList, Truck, Mail, Settings, LogOut, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()
  const { orderCount, wishlistCount } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
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
      setMobileSearchOpen(false)
    }
  }

  // Menu items
  const menuItems = [
    { href: '/', icon: Home, label: 'ទំព័រដើម' },
    { href: '/products', icon: Package, label: 'ផលិតផល' },
    { href: '/wishlist', icon: Heart, label: 'សំណព្វចិត្ត', badge: wishlistCount, badgeColor: 'pink' },
    { href: '/cart', icon: ShoppingCart, label: 'កន្ត្រក', badge: cartCount, badgeColor: 'pink' },
    { href: '/orders', icon: ClipboardList, label: 'ការបញ្ជា', badge: orderCount, badgeColor: 'green' },
    { href: '/track', icon: Truck, label: 'តាមដាន' },
    { href: '/contact', icon: Mail, label: 'ទំនាក់ទំនង' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-shadow">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
            Petal of Praise
            </span>
          </Link>

          {/* Desktop Search Bar (បានកែសម្រួលពណ៌អក្សរ និងបន្ថែមស្រមោលឱ្យច្បាស់) */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="ស្វែងរកផលិតផល..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // 💡 បានប្តូរទៅជា text-gray-900, placeholder-gray-500, font-medium និងប្តូរពណ៌ព្រំ border-gray-300
                className="w-full pl-10 pr-20 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-white text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:border-gray-400 transition"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 font-bold" />
              <button type="submit" className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold hover:bg-blue-700 transition shadow-sm active:scale-95">
                ស្វែងរក
              </button>
            </div>
          </form>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Search Icon for Mobile */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                👑 Admin
              </Link>
            )}
            
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition" onClick={() => setShowSettings(false)}>
                      <Settings className="w-4 h-4" />
                      ការកំណត់
                    </Link>
                    <button onClick={() => { signOut({ callbackUrl: '/' }); setShowSettings(false) }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full">
                      <LogOut className="w-4 h-4" />
                      ចាកចេញ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
                  <LogIn className="w-4 h-4" />
                  ចូល
                </Link>
                <Link href="/register" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                  <UserPlus className="w-4 h-4" />
                  ចុះឈ្មោះ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (បានកែសម្រួលឱ្យច្បាស់ល្អដូចគ្នាពេលបង្ហាញនៅលើទូរស័ព្ទ) */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-in fade-in duration-200">
            <form onSubmit={handleSearch}>
              <div className="relative px-1">
                <input
                  type="text"
                  placeholder="ស្វែងរកផលិតផល..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // 💡 កែសម្រួល text-gray-900, placeholder-gray-500 និងផ្ទៃខាងក្រោយសខ្ចី ដើម្បីកុំឱ្យព្រិលភ្នែកនៅលើទូរស័ព្ទ
                  className="w-full pl-10 pr-20 py-2.5 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-white text-gray-900 font-medium placeholder-gray-500 shadow-sm"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm active:scale-95">
                  ស្វែងរក
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop Navigation Menu */}
        <div className="hidden md:block mt-0 pt-3 pb-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition relative"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'
                  }`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                      item.badgeColor === 'green' ? 'bg-green-500' : 'bg-pink-500'
                    }`}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              {session?.user?.role === 'ADMIN' && (
                <Link href="/admin" className="flex items-center gap-3 text-blue-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-xl">👑</span>
                  Admin
                </Link>
              )}
              
              {session ? (
                <>
                  <Link href="/settings" className="flex items-center gap-3 text-gray-600 py-3 px-2 rounded-lg hover:bg-blue-50 transition" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="w-5 h-5" />
                    ការកំណត់
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false) }}
                    className="flex items-center gap-3 text-red-600 py-3 px-2 rounded-lg hover:bg-red-50 transition w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    ចាកចេញ
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-gray-100">
                  <Link href="/login" className="flex items-center justify-center gap-2 text-gray-600 py-2 px-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    ចូល
                  </Link>
                  <Link href="/register" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition" onClick={() => setMobileMenuOpen(false)}>
                    <UserPlus className="w-4 h-4" />
                    ចុះឈ្មោះ
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}