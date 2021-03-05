import Head from 'next/head'
import React from 'react'

interface Props {
  meta: {
    title: string
    description?: string
  }
  children?: React.ReactNode
}

export function Meta({ meta, children }: Props): React.ReactElement {
  const title = `${meta.title} | ellreka.net`
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={meta.description ?? 'ellreka.net'} />
      <meta property="og:description" content={meta.description ?? ''} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content="https://ellreka.net" />
      <meta property="og:type" content="blog" />
      <meta property="og:image" content="/favicon.ico" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@ellreka" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description ?? ''} />
      {children}
    </Head>
  )
}
