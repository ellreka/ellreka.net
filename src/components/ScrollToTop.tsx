'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()
  const isBackNavigation = useRef(false)

  useEffect(() => {
    // Check if this is a back/forward navigation
    const handlePopState = () => {
      isBackNavigation.current = true
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    // Only scroll to top if it's not a back navigation
    if (!isBackNavigation.current) {
      window.scrollTo(0, 0)
    }
    // Reset the flag after navigation
    isBackNavigation.current = false
  }, [pathname])

  return null
}