'use client'

import Script from 'next/script'

import { GA_TRACKING_ID } from '@/lib/gtag'
import { PageView } from './PageView'

export const GoogleAnalytics = () => {
  return (
    <>
      <Script
        id="ga-url"
        defer
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-script"
        defer
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());    
              gtag('config', '${GA_TRACKING_ID}');
            `
        }}
        strategy="afterInteractive"
      />
      <PageView />
    </>
  )
}
