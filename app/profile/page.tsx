'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/login')
    }
  }, [mounted, status])

  if (!mounted || status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!session) return null

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Password ថ្មីមិនដូចគ្នាទេ!')
      return
    }

    setLoading(true)
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto px-4">

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500">ឈ្មោះ</span>
              <span className="font-medium text-gray-800">{session.user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800">{session.user?.email}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 ប្តូរ Password</h2>

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm">
              ✅ {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
              ❌ {error}
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
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                បញ្ជាក់ Password ថ្មី
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl transition font-medium disabled:opacity-50"
            >
              {loading ? 'កំពុងប្តូរ...' : '🔐 ប្តូរ Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
