import React from 'react'
import Head from 'next/head'
// import { MetaType } from '../../types/'

type Props = {
  meta: {
    title: string
    description?: string
  }
}

export const Meta: React.FC<Props> = ({ meta, children }) => {
  return (
    <Head>
      <title>{meta.title} | ellreka.net</title>
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      {children}
    </Head>
  )
}
