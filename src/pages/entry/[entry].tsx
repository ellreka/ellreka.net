import fs from 'fs'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import path from 'path'
import React from 'react'
import { Adsense } from '../../components/Adsense'

import { EntryLayout } from '../../components/Entry'
import Layout from '../../components/Layout'
import { RelatedEntry } from '../../components/RelatedEntry'
import { Sidebar } from '../../components/Sidebar'
import { generateOgp } from '../../lib/generateOgp'
import { getEntries } from '../../lib/getEntries'
import { MetaType, EntryType } from '../../types'

interface Props {
  slug: string
  frontMatter: {
    meta: MetaType
    headings: Array<{ level: number; title: string }>
  }
  entries: EntryType[]
}

const root = process.cwd()

export function getStaticPaths(): { paths: string[]; fallback: boolean } {
  const docs = path.join(root, 'docs')
  const allDirents = fs.readdirSync(docs, { withFileTypes: true })
  const paths = allDirents
    .filter((dirent) => dirent.isFile())
    .map(({ name }) => `/entry/${name.replace(/\.mdx/, '')}`)
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (props) => {
  const entries = await getEntries()
  const slug = props.params?.entry as string
  const { meta, headings } = await import(`../../../docs/${slug}.mdx`)
  await generateOgp({ slug, title: meta.title })
  return {
    props: {
      slug,
      frontMatter: {
        meta,
        headings
      },
      entries: entries
        .filter((entry) =>
          entry.meta.tags.some((tag) => meta.tags.includes(tag))
        )
        .filter((entry) => entry.slug !== slug)
    }
  }
}

const Post = ({ slug, frontMatter, entries }: Props): React.ReactElement => {
  const MDXContent = dynamic(() => import(`../../../docs/${slug}.mdx`))
  const { meta, headings } = frontMatter
  return (
    <Layout>
      <div className="mx-auto mt-10 flex max-w-screen-xl justify-between">
        <div className="w-full lg:w-4/5">
          <EntryLayout slug={slug} meta={meta}>
            <MDXContent />
          </EntryLayout>
          {entries.length && (
            <div className="mt-20">
              <RelatedEntry entries={entries} />
            </div>
          )}
        </div>
        <div className="ml-6 hidden min-w-56 lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
      <div className="mt-10">
        <Adsense />
      </div>
    </Layout>
  )
}

export default Post
