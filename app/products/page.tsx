'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  category: string | null
}

type PaginationData = {
  total: number
  page: number
  limit: number
  totalPages: number
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

  // ស្តាប់ការប្តូរ URL ពី Navbar Search
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    
    if (search !== searchTerm) setSearchTerm(search)
    if (category !== selectedCategory) setSelectedCategory(category)
    if (page !== currentPage) setCurrentPage(page)
  }, [searchParams])

  // ទាញយកផលិតផល
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)
      params.append('page', currentPage.toString())
      params.append('limit', '8')
      
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products)
      setPagination(data.pagination)
      setLoading(false)
    }

    fetchProducts()
  }, [selectedCategory, searchTerm, currentPage])

  // ធ្វើបច្ចុប្បន្នភាព URL
  const updateURL = useCallback((newSearch: string, newCategory: string, newPage: number) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    if (newCategory) params.set('category', newCategory)
    if (newPage > 1) params.set('page', newPage.toString())
    
    router.replace(`/products?${params.toString()}`, { scroll: false })
  }, [router])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    updateURL(value, selectedCategory, 1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
    updateURL(searchTerm, value, 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(searchTerm, selectedCategory, page)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
    updateURL('', selectedCategory, 1)
  }

  const categories = [
    'ទាំងអស់',
    'ផ្កាកុលាប',
    'ផ្កាឈូក',
    'ផ្កាម្លិះ',
    'អ័រគីដេ',
    'ឈូករ័ត្ន',
    'លីលី',
    'ភួង'
  ]

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(pagination.totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            🌸 ផ្ការបស់យើង
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
            ជ្រើសរើសផ្កាដ៏ស្រស់ស្អាតសម្រាប់មនុស្សពិសេសរបស់អ្នក
          </p>
          
          {searchTerm && (
            <div className="mt-3 inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-xs sm:text-sm">
              <span>🔍</span>
              <span>លទ្ធផលសម្រាប់: <strong className="font-medium">"{searchTerm}"</strong></span>
              <button
                onClick={clearSearch}
                className="ml-1 text-pink-500 hover:text-pink-700 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Category Filter - Responsive */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === 'ទាំងអស់' ? '' : cat)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                  ${(cat === 'ទាំងអស់' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-pink-100 border border-gray-200'
                  }
                `}
              >
                {cat === 'ទាំងអស់' ? '🌸 ទាំងអស់' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State - Responsive Grid */}
        {loading && (
          <div>
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-base sm:text-lg">រកមិនឃើញផ្កាដែលអ្នកស្វែងរកទេ</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">សូមសាកល្បងពាក្យផ្សេង</p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-pink-500 hover:text-pink-600 underline text-sm"
              >
                មើលផ្កាទាំងអស់
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  បង្ហាញ {products.length} ក្នុងចំណោម {pagination.total} ប្រភេទ
                </p>
              </div>
              
              {/* Responsive Grid - Mobile: 2 columns, Desktop: up to 5 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination - Responsive */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition bg-white border 
border-gray-200 text-gray-600 
hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← មុន
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-pink-500 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-pink-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition bg-white border 
border-gray-200 text-gray-600 
hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    បន្ទាប់ →
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
