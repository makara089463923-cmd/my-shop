'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ 6 តួ')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordForm(false)
        
        // Update session
        await update()
        
        setTimeout(() => {
          setMessage('')
        }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚙️</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ការកំណត់គណនី</h1>
          <p className="text-gray-500 text-sm mt-2">គ្រប់គ្រងព័ត៌មាន និងសុវត្ថិភាពគណនីរបស់អ្នក</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{session.user?.name}</h2>
                <p className="text-gray-500 text-sm">{session.user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">សមាជិកចាប់តាំងពី...</p>
              </div>
            </div>
          </div>

          {/* Security Section - Change Password */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔐</span> សុវត្ថិភាព
            </h3>
            
            {!showPasswordForm ? (
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">ប្តូរពាក្យសម្ងាត់</p>
                  <p className="text-xs text-gray-400">ប្តូរពាក្យសម្ងាត់របស់អ្នកភ្លាមៗ</p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 text-sm font-medium text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition"
                >
                  ប្តូរពាក្យសម្ងាត់
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="យ៉ាងហោចណាស់ 6 តួ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                  />
                </div>
                
                {message && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">{message}</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition disabled:opacity-50"
                  >
                    {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setMessage('')
                      setError('')
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    បោះបង់
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Info Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> ព័ត៌មានគណនី
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">ឈ្មោះ</span>
                <span className="text-gray-800 font-medium">{session.user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">អ៊ីមែល</span>
                <span className="text-gray-800">{session.user?.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">តួនាទី</span>
                <span className="text-gray-800">{session.user?.role === 'ADMIN' ? 'អ្នកគ្រប់គ្រង' : 'អតិថិជន'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-pink-500 hover:text-pink-600">
            ← ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
      </div>
    </div>
  )
}
