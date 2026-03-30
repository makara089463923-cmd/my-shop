'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminProductsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin')
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">កំពុង redirect...</p>
    </div>
  )
}
