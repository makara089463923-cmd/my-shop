'use client'
import { useEffect } from 'react'
import Link from 'next/link'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
  link?: string
  linkText?: string
}

export default function Toast({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000,
  link,
  linkText = 'មើលឥឡូវ'
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type]

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm`}>
        <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-sm font-bold">
          {icon}
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium block">{message}</span>
          {link && (
            <Link 
              href={link} 
              onClick={onClose}
              className="text-xs text-white underline hover:text-gray-200 mt-1 inline-block"
            >
              {linkText} →
            </Link>
          )}
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}
