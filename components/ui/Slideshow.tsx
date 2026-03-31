'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Slide = {
  id: number
  image: string
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
}

type SlideshowProps = {
  slides: Slide[]
  autoPlay?: boolean
  interval?: number
}

export default function Slideshow({ slides, autoPlay = true, interval = 5000 }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  if (slides.length === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slide Image - Full screen no gap */}
      <div className="absolute inset-0">
<img
  src={currentSlide.image}
  alt={currentSlide.title}
  className="w-full h-full object-contain bg-gray-900"
/>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6 drop-shadow-md px-2">
            {currentSlide.description}
          </p>
          {currentSlide.buttonText && currentSlide.buttonLink && (
            <Link
              href={currentSlide.buttonLink}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              {currentSlide.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Buttons - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous slide"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-pink-500 w-4 sm:w-6 h-1.5 sm:h-2 rounded-full'
                  : 'bg-white/50 hover:bg-white/80 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
