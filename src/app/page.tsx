import React from 'react'

import { List } from '@/components/List'
import { Title } from '@/components/Title'
import { getEntries } from '@/lib/getEntries'
import { Meta } from '@/components/Meta'

const Home = async () => {
  const entries = await getEntries()
  return (
    <>
      <Meta
        meta={{
          title: 'ブログ一覧',
          description: 'ブログ一覧'
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>Entries</Title>
        <List entries={entries} />
      </div>
    </>
  )
}

export default Home
