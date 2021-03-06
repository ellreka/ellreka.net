import Link from 'next/link'
import React from 'react'

import { MetaType } from '../../types'

interface Props {
  entries: Array<{
    slug: string
    frontMatter: MetaType
  }>
}

export const List = ({ entries }: Props): React.ReactElement => {
  return (
    <div className="mt-4">
      {entries.map((entry) => (
        <div key={entry.slug} className="mb-8 pt-8">
          <Link href="/entry/[entry]" as={`/entry/${entry.slug}`}>
            <a className="inline-block">
              <h2 className="text-blue-400 hover:text-blue-600 text-sm md:text-lg">
                {entry.frontMatter.title}
              </h2>
            </a>
          </Link>
          <div className="flex items-end justify-between mt-3">
            <div className="flex items-end">
              <p className="text-black dark:text-white text-xs md:text-sm">
                Tags:
              </p>
              <ul>
                {entry.frontMatter.tags.map((tag) => (
                  <li
                    key={tag}
                    className="inline-block ml-1 px-2 text-white text-xs bg-gray-700 rounded-full md:text-sm">
                    <Link href={`/tag/${tag}`}>
                      <a>{tag}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="dark:text-gray-400 text-gray-600 text-xs md:text-sm">
              {entry.frontMatter.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
