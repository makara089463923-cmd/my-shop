'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(orders => {
        const found = orders.find((o: any) => o.id === params.id)
        setOrder(found)
      })
  }, [params.id])

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">កំពុងផ្ទុក...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order បានជោគជ័យ!</h1>
        <p className="text-gray-400 text-sm mb-6">Order ID: {order.id}</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between py-1">
              <span className="text-gray-600">{item.product?.name} x{item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>សរុប</span>
            <span className="text-blue-600">${order.total?.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/products')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
        >
          ទៅ Shopping បន្ត
        </button>
      </div>
    </div>
  )
}
