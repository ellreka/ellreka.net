import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import React from 'react'

import Layout from '../components/Layout'
import { List } from '../components/List'
import { Meta } from '../components/Meta'
import { Title } from '../components/Title'
import { getEntries } from '../lib/getEntries'
import { EntryType, MetaType } from '../types'

const root = process.cwd()

interface Props {
  entries: EntryType[]
}

const meta = {
  title: 'ブログ一覧',
  description: 'ブログ一覧'
}

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const entries = await getEntries()

  return { props: { entries } }
}

const Home = ({ entries }: Props): React.ReactElement => {
  return (
    <Layout>
      <Meta meta={meta} />
      <div className="mx-auto max-w-2xl">
        <Title>Entries</Title>
        <List entries={entries} />
      </div>
    </Layout>
  )
}

export default Home
