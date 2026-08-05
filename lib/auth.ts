// import NextAuth from 'next-auth'
// import Credentials from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { prisma } from './prisma'
// import bcrypt from 'bcryptjs'

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email as string },
//         })

//         if (!user) return null

//         const isValid = await bcrypt.compare(
//           credentials.password as string,
//           user.password
//         )

//         if (!isValid) return null

//         console.log('✅ Authorized user:', { id: user.id, name: user.name, email: user.email, role: user.role })
        
//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//   },
//   session: { 
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       console.log('🔑 JWT callback - token before:', token)
//       console.log('🔑 JWT callback - user:', user)
//       if (user) {
//         token.id = user.id
//         token.role = user.role
//         token.name = user.name
//         token.email = user.email
//       }
//       console.log('🔑 JWT callback - token after:', token)
//       return token
//     },
//     async session({ session, token }) {
//       console.log('📋 Session callback - session before:', session)
//       console.log('📋 Session callback - token:', token)
//       if (session?.user) {
//         session.user.id = token.id as string
//         session.user.role = token.role as string
//         session.user.name = token.name as string
//         session.user.email = token.email as string
//       }
//       console.log('📋 Session callback - session after:', session)
//       return session
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   trustHost: true,
//   debug: true,
// })






import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google' // ១. Import Google Provider ចូលមក
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any, // ២. បន្ថែម Adapter ទីនេះដើម្បីឱ្យវា save user ចូល Database ស្វ័យប្រវត្តិពេល Login តាម Google
  providers: [
    Google({ // ៣. កំណត់ Google Provider
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null // ការពារกรณี User ចុះឈ្មោះតាម Google គ្មាន Password

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'USER' // កំណត់ role default ពេល login តាម google //
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: true,
})