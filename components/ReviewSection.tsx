'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Trash2, Edit2 } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

interface ReviewSectionProps {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products/${productId}/reviews`)
      const data = await res.json()
      
      // ការពារ error - ប្រសិនបើ data.reviews មិនមែនជា array
      const reviewsData = Array.isArray(data.reviews) ? data.reviews : []
      setReviews(reviewsData)
      
      // ពិនិត្យមើលថាអ្នកប្រើបានធ្វើការវាយតម្លៃរួចហើយឬនៅ
      if (session?.user?.email && Array.isArray(reviewsData)) {
        const userReview = reviewsData.find(
          (r: Review) => r.user?.email === session.user?.email
        )
        if (userReview) {
          setEditingId(userReview.id)
          setEditRating(userReview.rating)
          setEditComment(userReview.comment)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('សូមចូលគណនីដើម្បីវាយតម្លៃ')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })

      if (res.ok) {
        setRating(5)
        setComment('')
        await fetchReviews()
      } else {
        const error = await res.json()
        alert(error.error || 'មានបញ្ហាក្នុងការវាយតម្លៃ')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('មានបញ្ហាក្នុងការវាយតម្លៃ')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return

    try {
      setSubmitting(true)
      const res = await fetch(`/api/products/${productId}/reviews/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      })

      if (res.ok) {
        setEditingId(null)
        await fetchReviews()
      } else {
        const error = await res.json()
        alert(error.error || 'មានបញ្ហាក្នុងការកែប្រែ')
      }
    } catch (error) {
      console.error('Error updating review:', error)
      alert('មានបញ្ហាក្នុងការកែប្រែ')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('តើអ្នកពិតជាចង់លុបការវាយតម្លៃនេះមែនទេ?')) return

    try {
      const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchReviews()
      } else {
        const error = await res.json()
        alert(error.error || 'មានបញ្ហាក្នុងការលុប')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('មានបញ្ហាក្នុងការលុប')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditRating(5)
    setEditComment('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Rating Stars Component
  const RatingStars = ({ value, onChange, size = 'md' }: { value: number; onChange: (val: number) => void; size?: 'sm' | 'md' }) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`${starSize} ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } hover:scale-110 transition`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Display Stars (readonly)
  const DisplayStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5'
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="mt-12">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ⭐ ការវាយតម្លៃ និងមតិ
        </h2>

        {/* Rating Summary */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
            <DisplayStars rating={Math.round(averageRating)} size="md" />
            <div className="text-sm text-gray-500 mt-1">
              {reviews.length} {reviews.length <= 1 ? 'ការវាយតម្លៃ' : 'ការវាយតម្លៃ'}
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="w-12 text-sm text-gray-600">{star} ★</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-10 text-sm text-gray-500">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Review Form - Only show if user hasn't reviewed or is editing */}
        {session && (!editingId || editingId === null) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">សរសេរការវាយតម្លៃរបស់អ្នក</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  កម្រិតពិន្ទុ
                </label>
                <RatingStars value={rating} onChange={setRating} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  មតិរបស់អ្នក
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ចែករំលែកបទពិសោធន៍របស់អ្នក..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'កំពុងដំណើរការ...' : 'ផ្ញើការវាយតម្លៃ'}
              </button>
            </form>
          </div>
        )}

        {/* Edit Form */}
        {editingId && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">កែប្រែការវាយតម្លៃរបស់អ្នក</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                កម្រិតពិន្ទុ
              </label>
              <RatingStars value={editRating} onChange={setEditRating} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                មតិរបស់អ្នក
              </label>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'កំពុងដំណើរការ...' : 'រក្សាទុក'}
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                បោះបង់
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">មិនទាន់មានការវាយតម្លៃនៅឡើយទេ</p>
            <p className="text-gray-400 text-sm mt-1">សូមចូលរួមចំណែកមតិរបស់អ្នក</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800">{review.user.name}</div>
                      <DisplayStars rating={review.rating} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{formatDate(review.createdAt)}</div>
                    {session?.user?.email === review.user.email && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(review.id)
                            setEditRating(review.rating)
                            setEditComment(review.comment)
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}