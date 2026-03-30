'use client'

type RatingStarsProps = {
  rating: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function RatingStars({ 
  rating, 
  size = 20, 
  interactive = false,
  onChange 
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5]

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= rating ? '#fbbf24' : '#e5e7eb'}
            stroke={star <= rating ? '#f59e0b' : '#d1d5db'}
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}
