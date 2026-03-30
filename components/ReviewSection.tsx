'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import RatingStars from './ui/RatingStars'
import Toast from './ui/Toast'

type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
}

type ReviewSectionProps = {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    const res = await fetch(`/api/products/${productId}/reviews`)
    const data = await res.json()
    setReviews(data.reviews)
    setAverageRating(data.averageRating)
    setTotalReviews(data.totalReviews)

    if (session?.user?.email) {
      const userReview = data.reviews.find(
        (r: Review) => r.user.email === session.user.email
      )
      if (userReview) {
        setHasReviewed(true)
        setUserRating(userReview.rating)
        setUserComment(userReview.comment || '')
      }
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      setToastMessage('សូម login មុនពេលវាយតម្លៃ')
      setToastType('error')
      setShowToast(true)
      return
    }

    if (userRating === 0) {
      setToastMessage('សូមជ្រើសរើសផ្កាយ')
      setToastType('error')
      setShowToast(true)
      return
    }

    setSubmitting(true)

    const method = hasReviewed ? 'PUT' : 'POST'
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: userRating, comment: userComment }),
    })

    if (res.ok) {
      setToastMessage(
        hasReviewed 
          ? '✓ បានកែប្រែការវាយតម្លៃរបស់អ្នកហើយ!'
          : '✓ អរគុណសម្រាប់ការវាយតម្លៃ!'
      )
      setToastType('success')
      setShowToast(true)
      setHasReviewed(true)
      fetchReviews()
    } else {
      const error = await res.json()
      setToastMessage(error.error || 'មានបញ្ហា សូមសាកម្តងទៀត')
      setToastType('error')
      setShowToast(true)
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        ⭐ ការវាយតម្លៃ ({totalReviews})
      </h3>

      <div className="flex items-center gap-4 mb-6 p-4 bg-pink-50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
          <RatingStars rating={averageRating} size={18} />
          <div className="text-sm text-gray-500 mt-1">ពី {totalReviews} ការវាយតម្លៃ</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">
          {hasReviewed ? 'កែប្រែការវាយតម្លៃរបស់អ្នក' : 'សរសេរការវាយតម្លៃ'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ផ្កាយ
            </label>
            <RatingStars
              rating={userRating}
              size={28}
              interactive={true}
              onChange={setUserRating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              មតិ (ស្រេចចិត្ត)
            </label>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 
focus:border-transparent"
              placeholder="ចែករំលែកបទពិសោធន៍របស់អ្នក..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
          >
            {submitting ? 'កំពុងរក្សាទុក...' : hasReviewed ? 'កែប្រែ' : 'ផ្ញើការវាយតម្លៃ'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            មិនទាន់មានការវាយតម្លៃទេ។ សូមក្លាយជាមនុស្សដំបូង!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{review.user.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('km-KH')}
                </span>
              </div>
              <RatingStars rating={review.rating} size={16} />
              {review.comment && (
                <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  )
}
