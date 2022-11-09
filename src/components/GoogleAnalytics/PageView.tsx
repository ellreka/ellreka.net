'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview } from '@/lib/gtag'

const usePageView = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname != null) {
      pageview(pathname)
    }
  }, [pathname])
}

export const PageView = () => {
  usePageView()
  return <></>
}
