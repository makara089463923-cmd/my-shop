import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import SessionWrapper from '@/components/SessionWrapper'

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
          <Navbar />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  )
}
