import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Petal of Praise',
  description: 'ហាងលក់ផ្កាស្រស់ៗ នាំចូលពីប្រទេសហូឡង់',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="km">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <NotificationProvider>  {/* NotificationProvider នៅខាងក្រៅ WishlistProvider */}
              <WishlistProvider>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </WishlistProvider>
            </NotificationProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
