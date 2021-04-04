import '../styles/index.css'

import type { AppProps } from 'next/app'
import React from 'react'
import { useRouter } from 'next/router'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    router.events.on('routeChangeStart', (url: string) => {
      setLoading(true)
    })
    router.events.on('routeChangeComplete', (url: string) => {
      setLoading(false)
    })
  }, [router.pathname])

  return (
    <>
      {loading && <ProgressBar loading={loading} />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
