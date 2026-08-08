'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ChangePasswordResponse {
  message?: string
  error?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // កំណត់ mounted state នៅពេល component mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect ប្រសិនបើមិនទាន់ login
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/login')
    }
  }, [mounted, status, router]) // ✅ បន្ថែម router ទៅ dependencies

  // Handle change password
  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    // ពិនិត្យ password ថ្មី
    if (newPassword.length < 6) {
      setError('Password ថ្មីត្រូវមានយ៉ាងតិច 6 តួ')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Password ថ្មីមិនដូចគ្នាទេ!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data: ChangePasswordResponse = await res.json()

      if (res.ok) {
        setMessage(data.message || 'បានប្តូរ Password ដោយជោគជ័យ!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error || 'មានបញ្ហាក្នុងការប្តូរ Password')
      }
    } catch (err) {
      setError('មានបញ្ហាក្នុងការតភ្ជាប់ម៉ាស៊ីនមេ')
    } finally {
      setLoading(false)
    }
  }, [currentPassword, newPassword, confirmPassword])

  // Loading state
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto px-4">

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6 transition-all hover:shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">ឈ្មោះ</span>
              <span className="font-medium text-gray-800">{session.user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800">{session.user?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 ប្តូរ Password</h2>

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password បច្ចុប្បន្ន
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password ថ្មី
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="•••••••• (យ៉ាងតិច 6 តួ)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                បញ្ជាក់ Password ថ្មី
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>

            {/* Password strength indicator */}
            {newPassword && newPassword.length > 0 && (
              <div className="text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>កម្លាំង Password:</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        newPassword.length < 6 ? 'w-1/3 bg-red-500' :
                        newPassword.length < 10 ? 'w-2/3 bg-yellow-500' :
                        'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="font-medium">
                    {newPassword.length < 6 ? 'ខ្សោយ' :
                     newPassword.length < 10 ? 'មធ្យម' : 'រឹងមាំ'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  កំពុងប្តូរ...
                </span>
              ) : (
                '🔐 ប្តូរ Password'
              )}
            </button>
          </form>

          {/* Back to Home link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-pink-500 transition-colors"
            >
              ← ត្រឡប់ទៅទំព័រដើម
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}