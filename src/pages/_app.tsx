import type { AppProps } from 'next/app'
import '../styles/index.css'
import '@fortawesome/fontawesome-free/js/all'
import '@fortawesome/fontawesome-free/css/all.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
