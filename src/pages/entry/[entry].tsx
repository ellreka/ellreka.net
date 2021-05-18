/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import { GetStaticProps } from 'next'
import path from 'path'
import React from 'react'

import { EntryLayout } from '../../components/Entry'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'

interface Props {
  slug: string
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
  return {
    props: {
      slug
    }
  }
}

const Post = ({ slug }: Props): React.ReactElement => {
  const {
    default: MDXContent,
    frontMatter
  } = require(`../../../docs/${slug}.mdx`)
  const { meta, headings } = frontMatter
  return (
    <Layout>
      <div className="flex justify-between mt-24 mx-auto">
        <div className="w-full lg:w-4/5">
          <EntryLayout meta={{ ...meta, id: slug, description: meta.title }}>
            <MDXContent />
          </EntryLayout>
        </div>
        <div className="hidden ml-6 min-w-56 lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
    </Layout>
  )
}

export default Post
