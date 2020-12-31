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
  return (
    <Head>
      <title>{meta.title} | ellreka.net</title>
      {meta.description !== null && (
        <meta name="description" content={meta.description} />
      )}
      {children}
    </Head>
  )
}
