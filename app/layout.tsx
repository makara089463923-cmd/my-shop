import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import SessionWrapper from '@/components/SessionWrapper'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyShop',
  description: 'Online Shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <SessionWrapper>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
            </WishlistProvider>
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
