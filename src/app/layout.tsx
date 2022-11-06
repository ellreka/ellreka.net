import { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'
import '../styles/index.css'
import Loading from './loading'
import Layout from '../components/Layout'
import { GA_TRACKING_ID } from '../lib/gtag'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // const router = useRouter()
  // const pathname = usePathname()
  // console.log(pathname);
  // // const [loading, setLoading] = useState(true)

  // console.log(router)
  // useEffect(() => {
  //   const handleRouteChange = (url: string): void => {
  //     gtag('event', 'page_view', {
  //       url
  //     })
  //   }
  //   router.events.on('routeChangeStart', (url: string) => {
  //     setLoading(true)
  //   })
  //   router.events.on('routeChangeComplete', (url: string) => {
  //     handleRouteChange(url)
  //     setLoading(false)
  //   })
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange)
  //   }
  // }, [router.events])

  return (
    <html lang="ja">
      <head>
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap"
        /> */}
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {/* <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
          }}
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.GOOGLE_ADSENSE_CLIENT ?? ''
          }`}
          crossOrigin="anonymous"></script> */}
      </head>
      <body>
        <Suspense fallback={<Loading />}>
          {/* {loading && <ProgressBar loading={loading} />} */}
          <Layout>{children}</Layout>
        </Suspense>
      </body>
    </html>
  )
}
