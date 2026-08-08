'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Contact = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

// ✅ ដាក់ function នៅខាងក្រៅ component
function getStatusBadge(status: string) {
  const baseClass = "px-2.5 py-1 rounded-full text-xs font-medium"
  
  switch (status) {
    case 'unread':
      return <span className={`bg-red-100 text-red-700 ${baseClass}`}>មិនទាន់អាន</span>
    case 'read':
      return <span className={`bg-blue-100 text-blue-700 ${baseClass}`}>បានអាន</span>
    case 'replied':
      return <span className={`bg-green-100 text-green-700 ${baseClass}`}>បានឆ្លើយ</span>
    default:
      return <span className={`bg-gray-100 text-gray-700 ${baseClass}`}>{status}</span>
  }
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/contact')
      
      if (!res.ok) {
        throw new Error('Failed to fetch contacts')
      }
      
      const data: Contact[] = await res.json()
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'មានបញ្ហាក្នុងការទាញទិន្នន័យ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
    
    if (session.user?.role !== 'ADMIN' && session.user?.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchContacts()
  }, [session, status, router, fetchContacts])

  const updateStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id)
      
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to update status')
      }
      
      await fetchContacts()
      
      setToast({ message: 'បានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាព')
      setToast({ message: 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាព', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setUpdatingId(null)
    }
  }, [fetchContacts])

  const copyToClipboard = useCallback((email: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setToast({ message: 'បានចម្លងអ៊ីមែល!', type: 'success' })
          setTimeout(() => setToast(null), 3000)
        })
        .catch(() => {
          const textArea = document.createElement('textarea')
          textArea.value = email
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setToast({ message: 'បានចម្លងអ៊ីមែល!', type: 'success' })
          setTimeout(() => setToast(null), 3000)
        })
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setToast({ message: 'បានចម្លងអ៊ីមែល!', type: 'success' })
      setTimeout(() => setToast(null), 3000)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-800 mb-2">មានបញ្ហា!</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchContacts()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            ព្យាយាមម្តងទៀត
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-8">
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 transition-all ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📧 សារពីអតិថិជន</h1>
          <p className="text-gray-500">
            សរុប {contacts.length} {contacts.length === 1 ? 'សារ' : 'សារ'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">មិនទាន់អាន</span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-bold">
                {contacts.filter(c => c.status === 'unread').length}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">បានអាន</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-bold">
                {contacts.filter(c => c.status === 'read').length}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">បានឆ្លើយ</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-bold">
                {contacts.filter(c => c.status === 'replied').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {contacts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-medium">មិនទាន់មានសារទេ</p>
              <p className="text-sm mt-1">សារពីអតិថិជននឹងបង្ហាញនៅទីនេះ</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`p-6 transition-all hover:bg-gray-50 ${
                    contact.status === 'unread' ? 'bg-pink-50/30' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {contact.subject}
                        {contact.status === 'unread' && (
                          <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="font-medium text-gray-700">{contact.name}</span>
                        <span>&lt;{contact.email}&gt;</span>
                        <span>•</span>
                        <span>{new Date(contact.createdAt).toLocaleString('km-KH', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(contact.status)}
                      {contact.status === 'unread' && (
                        <button
                          onClick={() => updateStatus(contact.id, 'read')}
                          disabled={updatingId === contact.id}
                          className="text-blue-500 text-xs hover:text-blue-700 transition disabled:opacity-50"
                        >
                          {updatingId === contact.id ? (
                            <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            'សម្គាល់ថាបានអាន'
                          )}
                        </button>
                      )}
                      {contact.status === 'read' && (
                        <button
                          onClick={() => updateStatus(contact.id, 'replied')}
                          disabled={updatingId === contact.id}
                          className="text-green-500 text-xs hover:text-green-700 transition disabled:opacity-50"
                        >
                          {updatingId === contact.id ? (
                            <span className="inline-block w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            'សម្គាល់ថាបានឆ្លើយ'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {contact.message}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-700 text-sm font-medium transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>✉️</span>
                      ឆ្លើយតបតាមអ៊ីមែល
                      <span>→</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(contact.email)}
                      className="text-gray-400 hover:text-gray-600 text-sm transition"
                    >
                      📋 ចម្លងអ៊ីមែល
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => fetchContacts()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition text-sm"
          >
            🔄 ធ្វើឱ្យស្រស់
          </button>
        </div>
      </div>
    </div>
  )
}