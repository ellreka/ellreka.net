import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import path from 'path'
import React from 'react'

import Layout from '../../components/Layout'
import { List } from '../../components/List'
import { Meta } from '../../components/Meta'
import { Title } from '../../components/Title'
import { getEntries } from '../../lib/getEntries'
import { EntryType } from '../../types'

interface Props {
  tag: string
  entries: EntryType[]
}

export const getStaticPaths = async () => {
  const entries = await getEntries()
  const tags = entries.flatMap((entry) => entry.meta.tags)
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
  const entries = await getEntries()
  const filteringEntries = entries.filter((entry) => {
    return entry.meta.tags.includes(tag)
  })
  return { props: { tag, entries: filteringEntries } }
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
