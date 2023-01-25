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
    <div className="flex flex-col gap-8 divide-y divide-dashed divide-blue-200">
      {entries.map((entry) => (
        <div key={entry.slug} className="pt-8">
          <Link href={`/entry/${entry.slug}`} className="inline-block">
            <h2 className="text-sm text-blue-400 hover:text-blue-600 md:text-lg">
              {entry.meta.title}
            </h2>
          </Link>
          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-end">
              {/* <p className="text-xs text-black dark:text-white md:text-sm">
                Tags:
              </p> */}
              <ul className="flex flex-wrap gap-1">
                {entry.meta.tags.map((tag) => (
                  <li
                    key={tag}
                    className="inline-block rounded-full bg-gray-700 px-2 text-xs text-white md:text-sm">
                    <Link href={`/tag/${tag}`}>{tag}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <time
              dateTime={entry.meta.date}
              className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
              {entry.meta.date}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}
