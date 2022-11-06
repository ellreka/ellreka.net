import React from 'react'

import { List } from '../components/List'
import { Title } from '../components/Title'
import { getEntries } from '../lib/getEntries'

const fetchData = async () => {
  const entries = await getEntries()
  return entries
}

const Home = async () => {
  const entries = await fetchData()
  return (
    <>
      <div className="mx-auto max-w-2xl">
        <Title>Entries</Title>
        <List entries={entries} />
      </div>
    </>
  )
}

export default Home
