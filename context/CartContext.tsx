'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type CartContextType = {
  cartCount: number
  refreshCart: () => void
  addToCart: (productId: string) => Promise<void>
  orderNotification: boolean
  clearOrderNotification: () => void
}


const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)
const [orderNotification, setOrderNotification] = useState(false)

const clearOrderNotification = () => setOrderNotification(false)

  const fetchCartCount = async () => {
    if (!session) {
      setCartCount(0)
      return
    }

    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const cart = await res.json()
const total = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartCount(total)
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  }

  const addToCart = async (productId: string) => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    })

    if (res.ok) {
      await fetchCartCount()
    }
  }

  useEffect(() => {
    fetchCartCount()
  }, [session])

return (
  <CartContext.Provider value={{ 
    cartCount, 
    refreshCart: fetchCartCount, 
    addToCart,
    orderNotification,
    clearOrderNotification
  }}>
    {children}
  </CartContext.Provider>
)
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
