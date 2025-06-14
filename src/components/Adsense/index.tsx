'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, FC } from 'react'

export const Adsense: FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    try {
      if (window.adsbygoogle != null) {
        window.adsbygoogle.push({})
      }
    } catch (err) {}
  }, [pathname])

  return (
    <div key={pathname} className="h-auto w-full text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', margin: 'auto', width: 320, height: 70 }}
        data-ad-client={process.env.GOOGLE_ADSENSE_CLIENT}
        data-ad-slot="5914435371"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  )
}
