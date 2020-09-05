import React from 'react'
import Layout from '../components/Layout'
import { Title } from '../components/Title'
import { MetaType } from '../types'
import Link from 'next/link'
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

export const getStaticProps = async () => {
  const docs = path.join(root, 'docs')
  const entries = fs.readdirSync(docs).map((p) => {
    const content = fs.readFileSync(path.join(docs, p), 'utf8')
    return {
      slug: p.replace(/\.mdx/, ''),
      frontMatter: matter(content).data
    }
  })
  return { props: { entries } }
}

const Home: React.FC<Props> = ({ entries }) => {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <Title>Entries</Title>
        <div className="mt-4">
          {entries.map((entry) => (
            <div
              key={entry.slug}
              className="mb-8 pt-8 border-t-4 border-dotted border-blue-300">
              <Link href="/entry/[entry]" as={`/entry/${entry.slug}`}>
                <a>
                  <h2 className="text-blue-400 hover:text-blue-600 text-sm md:text-lg">
                    {entry.frontMatter.title}
                  </h2>
                </a>
              </Link>
              <div className="flex justify-between mt-3">
                <div className="flex items-end">
                  <p className="text-xs md:text-sm">Tags: </p>
                  <ul>
                    {entry.frontMatter.tags.map((tag) => (
                      <li
                        key={tag}
                        className="inline-block bg-gray-700 px-2 text-white rounded-full ml-1 md:text-sm text-xs">
                        <Link href={`/tag/${tag}`}>
                          <a>{tag}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  {entry.frontMatter.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Home
