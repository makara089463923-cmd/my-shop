'use client'
import { useState } from 'react'

type SocialShareProps = {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      '_blank'
    )
  }

  const shareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      '_blank'
    )
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-sm font-medium text-gray-500">ចែករំលែក:</p>
      <div className="flex gap-2 flex-wrap">

        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#1560c0] text-white px-4 py-2 rounded-xl transition text-sm 
font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 
11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 
1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>

        {/* Telegram */}
        <button
          onClick={shareOnTelegram}
          className="flex items-center gap-2 bg-[#26a5e4] hover:bg-[#1e8fcc] text-white px-4 py-2 rounded-xl transition text-sm 
font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 
7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 
1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 
3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 
3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 
5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Telegram
        </button>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm font-medium shadow-sm
            ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          {copied ? (
            <>✓ បានចម្លង!</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 
2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </>
          )}
        </button>

      </div>
    </div>
  )
}
