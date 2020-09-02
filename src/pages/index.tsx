import React from 'react'
import Layout from '../components/Layout'
import entries from '../../entries.json'
import Link from 'next/link'

const Home: React.FC = () => {
  console.log(entries)
  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-gray-700 text-2xl">Entries</h1>
        <div className="mt-12">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-8 pt-8 border-t-4 border-dotted border-blue-300">
            <Link href={`/entry/${entry.id}`}>
              <a>
                <h2 className="text-blue-400 hover:text-blue-600 text-lg">{entry.title}</h2>
              </a>
            </Link>
            <div className="flex justify-between mt-3">
              <div className="flex">
                <p>Tags: </p>
                <ul>
                  {entry.tags.map((tag) => (
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
              <p className="text-base text-gray-600">{entry.date}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </Layout>
  )
}

export default Home
