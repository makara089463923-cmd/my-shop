export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Petal of Praise",
          "description": "ហាងលក់ផ្កាធ្វើដោយដៃ (Handmade Flowers)",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "ទីតាំងពួកយើងនៅមិនទាន់មាននៅឡើយ",
            "addressLocality": "ភ្នំពេញ",
            "addressCountry": "KH"
          },
          "telephone": "+855 81 61 55 12",
          "email": "makara089463923@gmail.com",
          "openingHours": "Mo-Su 07:00-19:00",
          "url": "https://drdaisy.uk",
          "image": "https://drdaisy.uk/images/logo.png"
        })
      }}
    />
  )
}
