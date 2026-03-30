'use client'
import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/export')
      if (!res.ok) {
        alert('មិនអាច export បានទេ!')
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('មានបញ្ហា សូមសាកម្តងទៀត')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition text-sm font-medium 
disabled:opacity-50"
    >
      {loading ? (
        <>⏳ កំពុង Export...</>
      ) : (
        <>📎 Export Orders Excel</>
      )}
    </button>
  )
}
