import { useRouter } from 'next/router'
import React, { useEffect, VFC } from 'react'

export const Adsense: VFC = () => {
  const { pathname } = useRouter()

  useEffect(() => {
    console.log({ pathname })
    if (window.adsbygoogle != null) {
      window.adsbygoogle.push({})
    }
  }, [pathname])

  return (
    <div key={pathname} className="w-full h-auto">
      <ins
        className="adsbygoogle block"
        data-ad-client={process.env.GOOGLE_ADSENSE_CLIENT}
        data-ad-slot="5914435371"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  )
}
