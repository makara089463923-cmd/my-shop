// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function RegisterPage() {
//   const router = useRouter()
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   // បិទ scrolling នៅផ្ទៃខាងក្រៅ
//   useEffect(() => {
//     document.body.style.overflow = 'hidden'
//     return () => {
//       document.body.style.overflow = 'auto'
//     }
//   }, [])

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     const form = e.currentTarget
//     const name = (form.elements.namedItem('name') as HTMLInputElement).value
//     const email = (form.elements.namedItem('email') as HTMLInputElement).value
//     const password = (form.elements.namedItem('password') as HTMLInputElement).value
//     const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value

//     if (password !== confirmPassword) {
//       setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា')
//       setLoading(false)
//       return
//     }

//     if (password.length < 6) {
//       setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ')
//       setLoading(false)
//       return
//     }

//     const res = await fetch('/api/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password }),
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       setError(data.error || 'មានបញ្ហា សូមសាកម្តងទៀត')
//       setLoading(false)
//     } else {
//       router.push('/login')
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
//       {/* Card Container - with max height */}
//       <div className="w-full max-w-md">
//         {/* Decorative Flower - smaller */}
//         <div className="text-center mb-4">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl 
// shadow-lg">
//             <span className="text-3xl">🌸</span>
//           </div>
//         </div>

//         {/* Card - with internal scroll if needed */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
//           {/* Card Header - compact */}
//           <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100 flex-shrink-0">
//             <h2 className="text-xl font-bold text-gray-800">បង្កើតគណនី</h2>
//             <p className="mt-1 text-xs text-gray-500">ចុះឈ្មោះដើម្បីចាប់ផ្តើមទិញផ្កា</p>
//           </div>

//           {/* Scrollable Body */}
//           <div className="overflow-y-auto px-6 py-5 flex-1">
//             {/* Error Message */}
//             {error && (
//               <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 
// 0118 0z" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-xs text-red-700">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Register Form - compact spacing */}
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
//                   ឈ្មោះពេញ
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   autoComplete="name"
//                   required
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 
// focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
//                   placeholder="ឈ្មោះរបស់អ្នក"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
//                   អ៊ីមែល
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 
// focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
//                   placeholder="your@email.com"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
//                   ពាក្យសម្ងាត់
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   minLength={6}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 
// focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
//                   placeholder="យ៉ាងតិច ៦ តួអក្សរ"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
//                   បញ្ជាក់ពាក្យសម្ងាត់
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 
// focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
//                   placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white 
// bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
// focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//               >
//                 {loading ? (
//                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 
// 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 ) : (
//                   'ចុះឈ្មោះ'
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Card Footer - compact */}
//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center flex-shrink-0">
//             <p className="text-xs text-gray-600">
//               មានគណនីរួចហើយ?{' '}
//               <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500 transition">
//                 ចូលគណនី
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }






'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react' // 1. Import signIn ពី next-auth/react

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // បិទ scrolling នៅផ្ទៃខាងក្រៅ
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ')
      setLoading(false)
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'មានបញ្ហា សូមសាកម្តងទៀត')
      setLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      {/* Card Container - with max height */}
      <div className="w-full max-w-md">
        {/* Decorative Flower - smaller */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg">
            <span className="text-3xl">🌸</span>
          </div>
        </div>

        {/* Card - with internal scroll if needed */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Card Header - compact */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800">បង្កើតគណនី</h2>
            <p className="mt-1 text-xs text-gray-500">ចុះឈ្មោះដើម្បីចាប់ផ្តើមទិញផ្កា</p>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto px-6 py-5 flex-1">
            {/* Error Message */}
            {error && (
              <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Register Form - compact spacing */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  ឈ្មោះពេញ
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="ឈ្មោះរបស់អ្នក"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  អ៊ីមែល
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  ពាក្យសម្ងាត់
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="យ៉ាងតិច ៦ តួអក្សរ"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                  បញ្ជាក់ពាក្យសម្ងាត់
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition"
                  placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'ចុះឈ្មោះ'
                )}
              </button>
            </form>

            {/* 2. ដាក់សញ្ញាខណ្ឌ និងប៊ូតុង Google Sign-In នៅត្រង់នេះ */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">ឬបន្តជាមួយ</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.18 21.34 7.22 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.6H1.18C.43 8.12 0 9.83 0 12s.43 3.88 1.18 5.4l4.09-3.16z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.66 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
              </svg>
              <span>ចូលប្រើជាមួយ Google</span>
            </button>
          </div>

          {/* Card Footer - compact */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center flex-shrink-0">
            <p className="text-xs text-gray-600">
              មានគណនីរួចហើយ?{' '}
              <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500 transition">
                ចូលគណនី
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}