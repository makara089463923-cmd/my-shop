'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval])

  if (slides.length === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group">
      {/* Slide Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {currentSlide.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 drop-shadow-md">
            {currentSlide.description}
          </p>
          {currentSlide.buttonText && currentSlide.buttonLink && (
            <Link
              href={currentSlide.buttonLink}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition 
transform hover:scale-105 shadow-lg"
            >
              {currentSlide.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full 
flex items-center justify-center transition opacity-0 group-hover:opacity-100"
      >
        ←
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full 
flex items-center justify-center transition opacity-0 group-hover:opacity-100"
      >
        →
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition ${
              currentIndex === index
                ? 'bg-pink-500 w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
