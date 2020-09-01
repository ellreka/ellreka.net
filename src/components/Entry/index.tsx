import React from 'react'
import Head from 'next/head'

type Props = {
  meta: any
}

export const EntryLayout: React.FC<Props> = ({ meta, children }) => {
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      {children}
    </div>
  )
}
