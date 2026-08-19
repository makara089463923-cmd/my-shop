'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminHomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    sectionTitle: '',
    sectionSubtitle: '',
    aboutTitle: '',
    aboutContent: '',
    contactEmail: '',
    contactPhone: '',
  })

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchHomePage()
  }, [session])

  const fetchHomePage = async () => {
    try {
      const res = await fetch('/api/home')
      if (res.ok) {
        const data = await res.json()
        setForm({
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          heroImage: data.heroImage || '',
          sectionTitle: data.sectionTitle || '',
          sectionSubtitle: data.sectionSubtitle || '',
          aboutTitle: data.aboutTitle || '',
          aboutContent: data.aboutContent || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
        })
      }
    } catch (error) {
      console.error('Error fetching home page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMessage('✅ រក្សាទុកដោយជោគជ័យ!')
      } else {
        setMessage('❌ មានបញ្ហាក្នុងការរក្សាទុក')
      }
    } catch (error) {
      setMessage('❌ មានបញ្ហាក្នុងការរក្សាទុក')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">កំពុងផ្ទុក...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">កែប្រែ Home Page</h1>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input
              type="text"
              name="heroSubtitle"
              value={form.heroSubtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
            <input
              type="text"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.heroImage && (
              <div className="mt-2 relative h-40 w-full">
                <Image
                  src={form.heroImage}
                  alt="Hero"
                  fill
                  className="object-cover rounded-lg"
                  sizes="100vw"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              name="sectionTitle"
              value={form.sectionTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
            <input
              type="text"
              name="sectionSubtitle"
              value={form.sectionSubtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
            <input
              type="text"
              name="aboutTitle"
              value={form.aboutTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Content</label>
            <textarea
              name="aboutContent"
              value={form.aboutContent}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
          </button>
        </form>
      </div>
    </div>
  )
}