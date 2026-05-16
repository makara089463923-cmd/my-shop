'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ token: string }> | { token: string }
}

export default function ResetPasswordPage({ params }: PageProps) {
  const router = useRouter()
  
  const resolvedParams = 'then' in params ? React.use(params) : params
  const token = resolvedParams?.token

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [valid, setValid] = useState<boolean | null>(null)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setValid(false)
        return
      }

      try {
        console.log('Verifying token:', token)
        const res = await fetch(`/api/auth/verify-reset-token?token=${token}`)
        const data = await res.json()
        
        if (res.ok && data.valid === true) {
          setValid(true)
        } else {
          setValid(false)
        }
      } catch (error) {
        console.error('Verification error:', error)
        setValid(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ សូមពិនិត្យឡើងវិញ')
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
        body: JSON.stringify({ token, password }),
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4 relative z-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100">
          <div className="text-5xl mb-3">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">តំណភ្ជាប់មិនត្រឹមត្រូវ</h1>
          <p className="text-gray-500 text-sm mb-4">
            តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬផុតកំណត់ពេលវេលាហើយ
          </p>
          <Link href="/forgot-password" className="text-pink-500 hover:text-pink-600 text-sm font-medium inline-block p-2 pointer-events-auto">
            ស្នើសុំតំណភ្ជាប់ថ្មី
          </Link>
        </div>
      </div>
    )
  }

  return (
    // 💡 បានបន្ថែម `relative z-40` នៅទីនេះ ដើម្បីឱ្យទំព័រនេះអណ្តែតលើស្រទាប់ថ្លារបស់ Navbar ពេលបង្ហាញលើទូរស័ព្ទ
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4 relative z-40">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-900">កំណត់ពាក្យសម្ងាត់ថ្មី</h1>
          <p className="text-gray-600 text-sm mt-2">
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
              className="inline-block w-full bg-pink-500 text-white px-6 py-2.5 rounded-lg hover:bg-pink-600 transition text-center font-medium pointer-events-auto"
            >
              ចូលប្រើប្រាស់
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pointer-events-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">ពាក្យសម្ងាត់ថ្មី</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white shadow-sm text-base"
                placeholder="យ៉ាងហោចណាស់ 6 តួ"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white shadow-sm text-base"
                placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              // 💡 បន្ថែម touch-action និងធានាការចុចមិនឱ្យស្ទះនៅលើ Mobile
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50 font-semibold shadow-md active:scale-[0.98] select-none touch-manipulation relative z-50 cursor-pointer"
            >
              {loading ? 'កំពុងរក្សាទុក...' : 'កំណត់ពាក្យសម្ងាត់'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}