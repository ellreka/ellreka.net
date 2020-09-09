import React from 'react'
import { GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'
import { EntryLayout } from '../../components/Entry'
import fs from 'fs'
import path from 'path'

type Props = {
  slug: string
}

const root = process.cwd()

export function getStaticPaths() {
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
  const slug = props.params?.entry
  return {
    props: {
      slug
    }
  }
}

const Post: React.FC<Props> = (props) => {
  const {
    default: MDXContent,
    frontMatter
  } = require(`../../../docs/${props.slug}.mdx`)
  const { meta, headings } = frontMatter

  return (
    <Layout>
      <div className="mt-24 flex justify-between mx-auto">
        <div className="w-full lg:w-4/5">
          <EntryLayout meta={{ ...meta, id: props.slug }}>
            <MDXContent />
          </EntryLayout>
        </div>
        <div className="min-w-56 ml-6 hidden lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
    </Layout>
  )
}

export default Post
