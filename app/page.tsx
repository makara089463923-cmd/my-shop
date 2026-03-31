import Slideshow from '@/components/ui/Slideshow'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    image: '/images/slide-2.jpg',
    title: '🌸 ផ្កាស្រស់ៗ រាល់ថ្ងៃ',
    description: 'ផ្កាដែលបាននាំចូលពីប្រទេសហូឡង់ ធានាគុណភាព 100%',
    buttonText: 'ទិញឥឡូវ',
    buttonLink: '/products',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Slideshow */}
      <Slideshow slides={slides} autoPlay={false} />

      </div>
  )
}
