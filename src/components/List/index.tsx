import Link from 'next/link'
import React from 'react'

import { MetaType } from '../../types'

interface Props {
  entries: Array<{
    url: string
    site: string
    meta: MetaType
  }>
}

const getSiteInfo = (site: string) => {
  switch (site) {
    case 'zenn':
      return {
        host: 'zenn.dev',
        favicon: '/assets/logo/zenn.svg'
      }
    case 'ellreka':
      return {
        host: 'ellreka.net',
        favicon: '/favicon.ico'
      }
    default:
      return {
        host: 'unknown',
        favicon: '/favicon.ico'
      }
  }
}

export const List = ({ entries }: Props): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {entries.map((entry) => (
        <Entry
          key={entry.url}
          url={entry.url}
          site={entry.site}
          title={entry.meta.title}
          tags={entry.meta.tags}
          date={entry.meta.date}
        />
      ))}
    </div>
  )
}

export const Entry = ({
  url,
  site,
  title,
  tags,
  date
}: {
  url: string
  site: string
  title: string
  tags: string[]
  date: string
}) => {
  const siteInfo = getSiteInfo(site)
  return (
    <div className="inline-flex h-full flex-col rounded-md bg-gray-700 py-4 px-6 transition-all">
      <Link
        href={`/entries/${site}`}
        className="flex items-center gap-2 text-sm text-slate-400 hover:underline">
        <img className="h-[15px] w-[15px]" src={siteInfo.favicon} alt="" />
        {siteInfo.host}
      </Link>
      <Link
        href={url}
        target={site != 'ellreka' ? '_blank' : '_self'}
        className="my-5">
        <h2 className="text-sm font-bold text-blue-400 hover:text-blue-500 md:text-lg">
          {title}
        </h2>
      </Link>
      <div className="mt-auto flex items-center justify-between justify-self-end">
        <ul className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-block rounded-full bg-slate-600 px-2 text-xs text-white md:text-sm">
              <Link href={`/entries/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
        <time
          dateTime={date}
          className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
          {date}
        </time>
      </div>
    </div>
  )
}
