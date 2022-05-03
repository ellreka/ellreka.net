import fs from 'fs'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import path from 'path'
import React from 'react'
import { Adsense } from '../../components/Adsense'

import { EntryLayout } from '../../components/Entry'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'
import { generateOgp } from '../../lib/generateOgp'
import { MetaType } from '../../types'

interface Props {
  slug: string
  frontMatter: {
    meta: MetaType
    headings: Array<{ level: number; title: string }>
  }
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
  const slug = props.params?.entry as string
  const frontMatter = (await import(`../../../docs/${slug}.mdx`)).frontMatter
  await generateOgp({ slug, title: frontMatter.meta.title })
  return {
    props: {
      slug,
      frontMatter
    }
  }
}

const Post = ({ slug, frontMatter }: Props): React.ReactElement => {
  const MDXContent = dynamic(() => import(`../../../docs/${slug}.mdx`))
  const { meta, headings } = frontMatter
  return (
    <Layout>
      <div className="mx-auto mt-10 flex max-w-screen-xl justify-between">
        <div className="w-full lg:w-4/5">
          <EntryLayout
            meta={{
              ...meta,
              id: slug,
              description: meta.title,
              image: `https://ellreka.net/ogp/${slug}.png`
            }}>
            <MDXContent />
          </EntryLayout>
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
