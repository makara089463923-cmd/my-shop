'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type NotificationContextType = {
  orderCount: number
  wishlistCount: number
  refreshOrderCount: () => void
  refreshWishlistCount: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [orderCount, setOrderCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Use useEffect with session data directly
  useEffect(() => {
    console.log('🔔 Session status:', status)
    console.log('🔔 Session user:', session?.user)
    
    if (status === 'authenticated' && session?.user?.id) {
      console.log('✅ User authenticated, fetching counts for:', session.user.id)
      fetchOrderCount(session.user.id)
      fetchWishlistCount(session.user.id)
    } else {
      console.log('⚠️ Not authenticated or no user id, setting counts to 0')
      setOrderCount(0)
      setWishlistCount(0)
    }
  }, [status, session])

  const fetchOrderCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders/count?userId=${userId}`)
      const data = await res.json()
      console.log('📦 Order count:', data.count)
      setOrderCount(data.count)
    } catch (error) {
      console.error('Error fetching order count:', error)
    }
  }

  const fetchWishlistCount = async (userId: string) => {
    try {
      const res = await fetch(`/api/wishlist/count?userId=${userId}`)
      const data = await res.json()
      console.log('💖 Wishlist count:', data.count)
      setWishlistCount(data.count)
    } catch (error) {
      console.error('Error fetching wishlist count:', error)
    }
  }

  const refreshOrderCount = () => {
    if (session?.user?.id) {
      fetchOrderCount(session.user.id)
    }
  }
  
  const refreshWishlistCount = () => {
    if (session?.user?.id) {
      fetchWishlistCount(session.user.id)
    }
  }

  return (
    <NotificationContext.Provider value={{
      orderCount,
      wishlistCount,
      refreshOrderCount,
      refreshWishlistCount,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
