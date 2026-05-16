'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [valid, setValid] = useState<boolean | null>(null)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-reset-token?token=${params.token}`)
        const data = await res.json()
        
        if (data.valid === true) {
          setValid(true)
        } else {
          setValid(false)
        }
      } catch (error) {
        setValid(false)
      }
    }
    if (params.token) {
      verifyToken()
    }
  }, [params.token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា')
      return
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួ')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'ពាក្យសម្ងាត់របស់អ្នកត្រូវបានកំណត់ថ្មីដោយជោគជ័យ')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'មានបញ្ហា សូមសាកល្បងម្តងទៀត')
      }
    } catch (error) {
      setError('មានបញ្ហាក្នុងការភ្ជាប់ម៉ាស៊ីនមេ')
    } finally {
      setLoading(false)
    }
  }

  if (valid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">កំពុងផ្ទៀងផ្ទាត់...</p>
        </div>
      </div>
    )
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">តំណភ្ជាប់មិនត្រឹមត្រូវ</h1>
          <p className="text-gray-500 text-sm mb-4">
            តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬផុតកំណត់ពេលវេលាហើយ
          </p>
          <Link href="/forgot-password" className="text-pink-500 hover:text-pink-600 text-sm">
            ស្នើសុំតំណភ្ជាប់ថ្មី
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800">កំណត់ពាក្យសម្ងាត់ថ្មី</h1>
          <p className="text-gray-500 text-sm mt-2">
            សូមបញ្ចូលពាក្យសម្ងាត់ថ្មីរបស់អ្នក
          </p>
        </div>

        {message ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
            <Link
              href="/login"
              className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              ចូលប្រើប្រាស់
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ពាក្យសម្ងាត់ថ្មី</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="យ៉ាងហោចណាស់ 6 តួ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
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
              {loading ? 'កំពុងរក្សាទុក...' : 'កំណត់ពាក្យសម្ងាត់'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
