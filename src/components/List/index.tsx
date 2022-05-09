import Link from 'next/link'
import React from 'react'

import { MetaType } from '../../types'

interface Props {
  entries: Array<{
    slug: string
    meta: MetaType
  }>
}

export const List = ({ entries }: Props): React.ReactElement => {
  return (
    <div className="mt-4">
      {entries.map((entry) => (
        <div key={entry.slug} className="mb-8 pt-8">
          <Link href="/entry/[entry]" as={`/entry/${entry.slug}`}>
            <a className="inline-block">
              <h2 className="text-sm text-blue-400 hover:text-blue-600 md:text-lg">
                {entry.meta.title}
              </h2>
            </a>
          </Link>
          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-end">
              <p className="text-xs text-black dark:text-white md:text-sm">
                Tags:
              </p>
              <ul>
                {entry.meta.tags.map((tag) => (
                  <li
                    key={tag}
                    className="ml-1 inline-block rounded-full bg-gray-700 px-2 text-xs text-white md:text-sm">
                    <Link href={`/tag/${tag}`}>
                      <a>{tag}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
              {entry.meta.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
