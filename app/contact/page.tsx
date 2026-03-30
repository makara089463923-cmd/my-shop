'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/ui/Toast'

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  // បិទ scrolling នៅពេលចូលមកទំព័រនេះ
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (res.ok) {
      setToastMessage(data.message || 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!')
      setToastType('success')
      setShowToast(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      setToastMessage(data.error || 'មានបញ្ហា សូមសាកម្តងទៀត')
      setToastType('error')
      setShowToast(true)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center 
overflow-hidden">
      {/* Container with margin top to push card down slightly */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-8 mb-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📧</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ទំនាក់ទំនងមកយើង</h1>
          <p className="text-sm text-gray-500">
            ប្រសិនបើអ្នកមានសំណួរ ឬចង់បានព័ត៌មានបន្ថែម
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[80vh] flex flex-col">
          {/* Card Header */}
          <div className="px-6 pt-5 pb-3 text-center border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-800">ផ្ញើសារមកយើង</h2>
            <p className="mt-1 text-xs text-gray-400">យើងនឹងឆ្លើយតបអ្នកក្នុងរយៈពេល 24 ម៉ោង</p>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  ឈ្មោះពេញ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="ឈ្មោះរបស់អ្នក"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  អ៊ីមែល <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  ប្រធានបទ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="ប្រធានបទដែលអ្នកចង់ទាក់ទង"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  សារ <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm placeholder-gray-400 
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition resize-none"
                  placeholder="សូមបញ្ចូលសាររបស់អ្នកនៅទីនេះ..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-base font-medium text-white 
bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 
0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'ផ្ញើសារ'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info - Fixed Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl mb-1">📞</div>
                <p className="text-[11px] text-gray-500">ទូរស័ព្ទ</p>
                <p className="text-xs font-medium text-gray-700">+855 12 345 678</p>
              </div>
              <div>
                <div className="text-xl mb-1">✉️</div>
                <p className="text-[11px] text-gray-500">អ៊ីមែល</p>
                <p className="text-xs font-medium text-gray-700">info@myshop.com</p>
              </div>
              <div>
                <div className="text-xl mb-1">📍</div>
                <p className="text-[11px] text-gray-500">អាសយដ្ឋាន</p>
                <p className="text-xs font-medium text-gray-700">ភ្នំពេញ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  )
}
