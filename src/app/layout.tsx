import { Suspense } from 'react'
import '@/styles/index.css'
import Layout from '@/components/Layout'
import { M_PLUS_1p } from '@next/font/google'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'

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
        <Layout>
          <Suspense fallback={<ProgressBar loading={true} />}>
            {children}
          </Suspense>
        </Layout>
      </body>
    </html>
  )
}
