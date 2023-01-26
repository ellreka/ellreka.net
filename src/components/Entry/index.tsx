'use client'

// import { useWindowScroll } from 'react-use'
import clsx from 'clsx'
import Link from 'next/link'
import { ReactNode } from 'react'

import { MetaType } from '@/types'

interface Props {
  meta: MetaType
  slug: string
  children: ReactNode
}

export function EntryLayout({
  meta,
  children,
  slug
}: Props): React.ReactElement {
  // const { y } = useWindowScroll()
  // const y = 100
  return (
    <div className="relative">
      <div className={clsx('border-b-4 border-dotted border-blue-300 pb-12')}>
        <h1 className="text-xl font-bold dark:text-white">{meta.title}</h1>
        <div className={clsx('mt-4 flex items-center')}>
          <p className="text-base text-gray-600 dark:text-gray-300">
            created at: {meta.date}
          </p>
          <a
            href={`https://github.com/ellreka/ellreka.net/commits/master/docs/${slug}.mdx`}
            target="_blank"
            rel="noreferrer"
            className="ml-4 text-base text-blue-500">
            history
          </a>
        </div>
        <div className={clsx('mt-4 flex items-center')}>
          {/* <p className="text-black dark:text-white">Tags:</p> */}
          <ul className="inline-flex flex-wrap items-center gap-1">
            {meta.tags.map((tag, idx) => (
              <li
                key={idx}
                className="inline-block rounded-full bg-gray-700 px-2 text-white">
                <Link href={`/tag/${tag}`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12">{children}</div>
    </div>
  )
}
