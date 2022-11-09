import '@/styles/index.css'
import Layout from '@/components/Layout'
import { M_PLUS_1p } from '@next/font/google'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

const mPlus1p = M_PLUS_1p({
  weight: ['400', '700']
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={mPlus1p.className}>
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
