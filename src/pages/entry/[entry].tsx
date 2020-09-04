import React from 'react'
import { GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'
import { EntryLayout } from '../../components/Entry'
import { MDXProvider } from '@mdx-js/react'
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
    .map(({ name }) => `/entry/${name.split('.')[0]}`)
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

  const components = {
    h2: (props: any) => {
      return (
        <h2
          className="text-xl mt-12 mb-4 font-medium border-l-4 border-solid border-blue-300 pl-2"
          id={props.children}
          {...props}
        />
      )
    },
    h3: (props: any) => {
      return (
        <h3
          className="text-lg mt-4 mb-4 font-medium"
          id={props.children}
          {...props}
        />
      )
    },
    p: (props: any) => <p className="text-sm leading-8 mt-4" {...props} />,
    img: (props: any) => <img className="w-1/2" {...props} />,
    a: (props: any) => <a className="text-blue-500" {...props} />,
    ul: (props: any) => <ul className="list" {...props} />,
    li: (props: any) => (
      <li className="relative mb-2" {...props}>
        <span className="mr-2">-</span>
        {props.children}
      </li>
    ),
    strong: (props: any) => <strong className="font-bold" {...props} />,
    inlineCode: (props: any) => (
      <code
        className="bg-gray-200 border border-solid border-gray-500 rounded-sm px-1 break-all"
        {...props}
      />
    ),
    blockquote: (props: any) => (
      <>
        <blockquote
          className="relative bg-gray-200 whitespace-pre-wrap text-gray-600 py-2 px-3 h-full border-l-4 border-solid border-gray-600"
          {...props}
        />
      </>
    )
  }
  return (
    <Layout>
      <div
        className="mt-24 flex justify-around mx-auto px-8 lg:px-24"
        // style={{ width: 'calc(100% - 120px)' }}
      >
        <div className="w-full lg:w-4/5">
          <EntryLayout meta={meta}>
            <MDXProvider components={components}>
              <MDXContent />
            </MDXProvider>
          </EntryLayout>
        </div>
        <div className="min-w-56 hidden lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
    </Layout>
  )
}

export default Post
