import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import path from 'path'
import React from 'react'

import Layout from '../../components/Layout'
import { List } from '../../components/List'
import { Meta } from '../../components/Meta'
import { Title } from '../../components/Title'
import { MetaType } from '../../types'

const root = process.cwd()

interface Props {
  tag: string
  entries: Array<{
    slug: string
    frontMatter: MetaType
  }>
}

export function getStaticPaths(): { paths: string[]; fallback: boolean } {
  const docs = path.join(root, 'docs')
  const tags: string[] = fs.readdirSync(docs).flatMap((p) => {
    const content = fs.readFileSync(path.join(docs, p), 'utf8')
    const frontMatter = matter(content).data
    return frontMatter.tags
  })
  const paths = Array.from(new Set(tags)).map((tag) => {
    return `/tag/${tag}`
  })
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (props) => {
  const tag = props.params?.tag as string
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
    .filter((entry) => {
      return entry.frontMatter.tags.includes(tag)
    })
    .sort(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime()
    )
  return { props: { tag, entries } }
}

const Tag = ({ tag, entries }: Props): React.ReactElement => {
  const meta = {
    title: `${tag}一覧`,
    description: `${tag}一覧`
  }
  return (
    <Layout>
      <Meta meta={meta} />
      <div className="mx-auto max-w-2xl">
        <Title>{tag}</Title>
        <List entries={entries} />
      </div>
    </Layout>
  )
}

export default Tag
