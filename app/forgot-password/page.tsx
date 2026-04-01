'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSent(true)
        setMessage(data.message || 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក')
      } else {
        setError(data.error || 'មានបញ្ហា សូមសាកល្បងម្តងទៀត')
      }
    } catch (error) {
      setError('មានបញ្ហាក្នុងការភ្ជាប់ម៉ាស៊ីនមេ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">ភ្លេចពាក្យសម្ងាត់?</h1>
          <p className="text-gray-500 text-sm mt-2">
            បញ្ចូលអ៊ីមែលរបស់អ្នក យើងនឹងផ្ញើតំណភ្ជាប់សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
            <Link
              href="/login"
              className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              ត្រឡប់ទៅទំព័រចូលប្រើ
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">អ៊ីមែល</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
            >
              {loading ? 'កំពុងផ្ញើ...' : 'ផ្ញើតំណភ្ជាប់'}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="text-sm text-pink-500 hover:text-pink-600">
                ← ត្រឡប់ទៅចូលប្រើ
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
