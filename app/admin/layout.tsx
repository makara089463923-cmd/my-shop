import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-6 fixed">
          <h2 className="text-xl font-bold mb-8">🛡️ Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <a href="/admin" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              📊 Dashboard
            </a>
            <a href="/admin/products" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              📦 Products
            </a>
            <a href="/admin/orders" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              🛒 Orders
            </a>
            <a href="/admin/users" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              👥 Users
            </a>
            <a href="/admin/contacts" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              📧 Contacts
            </a>
            <hr className="border-gray-700 my-2"/>
            <a href="/" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition text-gray-400">
              ← ត្រឡប់ Shop
            </a>
          </nav>
        </aside>
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
