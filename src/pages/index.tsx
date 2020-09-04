import React from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

type Props = {
  entries: Array<{
    slug: string
    frontMatter: {
      id: string
      title: string
      description: string
      date: string
      tags: string[]
    }
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
        <h1 className="text-gray-700 text-2xl">Entries</h1>
        <div className="mt-12">
          {entries.map((entry) => (
            <div
              key={entry.slug}
              className="mb-8 pt-8 border-t-4 border-dotted border-blue-300">
              <Link href="/entry/[entry]" as={`/entry/${entry.slug}`}>
                <a>
                  <h2 className="text-blue-400 hover:text-blue-600 text-lg">
                    {entry.frontMatter.title}
                  </h2>
                </a>
              </Link>
              <div className="flex justify-between mt-3">
                <div className="flex">
                  <p>Tags: </p>
                  <ul>
                    {entry.frontMatter.tags.map((tag) => (
                      <li
                        key={tag}
                        className="inline-block bg-gray-700 px-2 text-white rounded-full ml-3 text-sm">
                        <Link href={`/tag/${tag}`}>
                          <a>{tag}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-base text-gray-600">
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
