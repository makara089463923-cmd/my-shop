'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type WishlistItem = {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    image: string | null
    stock: number
  }
}

type WishlistContextType = {
  wishlist: WishlistItem[]
  wishlistCount: number
  isLoading: boolean
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchWishlist = async () => {
    if (!session) {
      setWishlist([])
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const data = await res.json()
        setWishlist(data)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [session])

  const addToWishlist = async (productId: string) => {
    if (!session) {
      window.location.href = '/login'
      return false
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        await fetchWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      return false
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      return false
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId)
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
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
