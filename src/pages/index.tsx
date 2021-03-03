import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import React from 'react'

import Layout from '../components/Layout'
import { List } from '../components/List'
import { Meta } from '../components/Meta'
import { Title } from '../components/Title'
import { MetaType } from '../types'

const root = process.cwd()

interface Props {
  entries: Array<{
    slug: string
    frontMatter: MetaType
  }>
}

const meta = {
  title: 'ブログ一覧'
}

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const docs = path.join(root, 'docs')
  const entries = fs
    .readdirSync(docs)
    .map((p) => {
      const content = fs.readFileSync(path.join(docs, p), 'utf8')
      return {
        slug: p.replace(/\.mdx/, ''),
        frontMatter: matter(content).data as MetaType
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime()
    )

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
