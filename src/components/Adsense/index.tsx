import { useRouter } from 'next/router'
import React, { useEffect, VFC } from 'react'

export const Adsense: VFC = () => {
  const { pathname } = useRouter()

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
        data-full-width-responsive="true"></ins>
    </div>
  )
}
