import Head from 'next/head'
import React from 'react'

interface Props {
  meta: {
    title: string
    description?: string
    image?: string
  }
  children?: React.ReactNode
  isEntry?: boolean
}

export function Meta({
  meta,
  children,
  isEntry = false
}: Props): React.ReactElement {
  const title = `${meta.title} | ellreka.net`
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={meta.description ?? 'ellreka.net'} />
      <meta property="og:description" content={meta.description ?? ''} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content="https://ellreka.net" />
      <meta property="og:type" content="blog" />
      {isEntry ? (
        <>
          <meta property="og:image" content={meta.image} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      ) : (
        <>
          <meta property="og:image" content="/favicon.ico" />
          <meta name="twitter:card" content="summary" />
        </>
      )}
      <meta name="twitter:creator" content="@ellreka" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description ?? ''} />
      {children}
    </Head>
  )
}
