import React from 'react'
import Layout from '../components/Layout'
import { Title } from '../components/Title'
import { List } from '../components/List'
import { Meta } from '../components/Meta'
import { MetaType } from '../types'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

type Props = {
  entries: Array<{
    slug: string
    frontMatter: MetaType
  }>
}

const meta = {
  title: 'ブログ一覧'
}

export const getStaticProps = async () => {
  const docs = path.join(root, 'docs')
  const entries = fs.readdirSync(docs).map((p) => {
    const content = fs.readFileSync(path.join(docs, p), 'utf8')
    return {
      slug: p.replace(/\.mdx/, ''),
      frontMatter: matter(content).data
    }
  })
  console.log(entries)
  return { props: { entries } }
}

const Home: React.FC<Props> = ({ entries }) => {
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
