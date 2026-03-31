'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useNotifications } from './NotificationContext'

type WishlistContextType = {
  wishlist: any[]
  loading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Safe access to useNotifications - will work if NotificationProvider is parent
  let refreshWishlistCount: (() => void) | undefined
  try {
    const notifications = useNotifications()
    refreshWishlistCount = notifications.refreshWishlistCount
  } catch (e) {
    // If NotificationProvider not found, just log and continue
    console.log('NotificationProvider not found, wishlist count will not auto-refresh')
    refreshWishlistCount = () => {}
  }

  const fetchWishlist = async () => {
    if (!session?.user?.id) {
      setWishlist([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const data = await res.json()
        setWishlist(data)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!session?.user?.id) {
      window.location.href = '/login'
      return
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        await fetchWishlist()
        if (refreshWishlistCount) refreshWishlistCount()
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        await fetchWishlist()
        if (refreshWishlistCount) refreshWishlistCount()
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId)
  }

  useEffect(() => {
    fetchWishlist()
  }, [session])

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist: fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
