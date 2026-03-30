'use client'
import { useState, useEffect, useCallback } from 'react'
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

export default function ProductsPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            🌸 ផ្ការបស់យើង
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            ជ្រើសរើសផ្កាដ៏ស្រស់ស្អាតសម្រាប់មនុស្សពិសេសរបស់អ្នក
          </p>
          
          {searchTerm && (
            <div className="mt-3 inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-sm">
              <span>🔍</span>
              <span>លទ្ធផលសម្រាប់: <strong>"{searchTerm}"</strong></span>
              <button
                onClick={clearSearch}
                className="ml-1 text-pink-500 hover:text-pink-700 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === 'ទាំងអស់' ? '' : cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">រកមិនឃើញផ្កាដែលអ្នកស្វែងរកទេ</p>
            <p className="text-gray-400 text-sm mt-1">សូមសាកល្បងពាក្យផ្សេង</p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-pink-500 hover:text-pink-600 underline"
              >
                មើលផ្កាទាំងអស់
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  បង្ហាញ {products.length} ក្នុងចំណោម {pagination.total} ប្រភេទ
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition bg-white border border-gray-200 text-gray-600 
hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← មុន
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
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
                    className="px-3 py-2 rounded-lg text-sm font-medium transition bg-white border border-gray-200 text-gray-600 
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
