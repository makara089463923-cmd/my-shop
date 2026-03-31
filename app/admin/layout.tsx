// app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

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
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  )
}
