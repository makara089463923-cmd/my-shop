'use client'
import { useEffect, useState } from 'react'
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

export default function AdminContactsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchContacts()
  }, [session, status])

  const fetchContacts = async () => {
    const res = await fetch('/api/contact')
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchContacts()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">មិនទាន់អាន</span>
      case 'read':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">បានអាន</span>
      case 'replied':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">បានឆ្លើយ</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>
    }
  }

  if (loading) return <div className="text-center py-20">កំពុងផ្ទុក...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📧 សារពីអតិថិជន</h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {contacts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p>មិនទាន់មានសារទេ</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{contact.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {contact.name} &lt;{contact.email}&gt; • {new Date(contact.createdAt).toLocaleString('km-KH')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(contact.status)}
                      {contact.status === 'unread' && (
                        <button
                          onClick={() => updateStatus(contact.id, 'read')}
                          className="text-blue-500 text-xs hover:underline"
                        >
                          សម្គាល់ថាបានអាន
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      className="text-pink-500 text-sm hover:underline"
                    >
                      ឆ្លើយតបតាមអ៊ីមែល →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
