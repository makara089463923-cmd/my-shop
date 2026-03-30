'use client'
import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: { orders: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUser) return
    setResetting(true)
    setMessage('')
    setError('')

    const res = await fetch('/api/admin/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, newPassword }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage(`✅ ${data.message}`)
      setNewPassword('')
      setSelectedUser(null)
    } else {
      setError(`❌ ${data.error}`)
    }
    setResetting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 Users</h1>

      {message && <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      {/* Reset Password Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-1">🔐 Reset Password</h2>
            <p className="text-gray-500 text-sm mb-4">User: <strong>{selectedUser.name}</strong> ({selectedUser.email})</p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Password ថ្មី (យ៉ាងតិច 6 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
                >
                  {resetting ? 'កំពុង Reset...' : '🔐 Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setNewPassword('') }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition"
                >
                  បោះបង់
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500">
              <th className="text-left py-3 px-4">ឈ្មោះ</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Orders</th>
              <th className="text-left py-3 px-4">កាលបរិច្ឆេទ</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-gray-500">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{user._count.orders}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => { setSelectedUser(user); setMessage(''); setError('') }}
                    className="text-pink-500 hover:underline text-xs"
                  >
                    🔐 Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
