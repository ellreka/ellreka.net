import '../styles/index.css'

import type { AppProps } from 'next/app'
import React from 'react'
import { useRouter } from 'next/router'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const handleRouteChange = (url: string): void => {
      gtag('event', 'page_view', {
        url
      })
    }
    router.events.on('routeChangeStart', (url: string) => {
      setLoading(true)
    })
    router.events.on('routeChangeComplete', (url: string) => {
      handleRouteChange(url)
      setLoading(false)
    })
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {loading && <ProgressBar loading={loading} />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
