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
      <head>
      ​  {/* Basic favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
        {/* Android Chrome */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
  
        {/* ... rest of your existing head tags ... */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Petal of Praise",
              "description": "ហាងលក់ផ្កាធ្វើដោយដៃ (Handmade Flowers)",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "ទីតាំង​ពូួកយើងនៅមិនទាន់មាននៅឡើយ",
                "addressLocality": "ភ្នំពេញ",
                "addressCountry": "KH"
              },
              "telephone": "+855 81 61 55 12",
              "email": "makara089463923@gmail.com",
              "openingHours": "Mo-Su 07:00-19:00",
              "url": "https://drdaisy.uk",
              "image": "https://drdaisy.uk/images/logo.png"
            })
          }}
        />
      </head>
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
