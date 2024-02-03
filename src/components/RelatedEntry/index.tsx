import { FC } from 'react'
import { EntryType } from '../../types'
import NextLink from 'next/link'
import { Entry } from '../List'

interface Props {
  entries: EntryType[]
}

export const RelatedEntry: FC<Props> = ({ entries }) => {
  return (
    <div>
      <div className="text-lg font-bold text-white">Related Entries</div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {entries.map((entry) => {
          const url = `/entry/${entry.slug}`
          return (
            // <NextLink
            //   key={entry.slug}
            //   href={`/entry/${entry.slug}`}
            //   className="relative block h-auto w-full overflow-hidden rounded-md shadow-inner">
            //   <span className="text-blue-400 hover:text-blue-600">
            //     {entry.meta.title}
            //   </span>
            // </NextLink>
            <Entry
              key={entry.slug}
              url={url}
              site={'ellreka'}
              title={entry.meta.title}
              tags={entry.meta.tags}
              date={entry.meta.date}
            />
          )
        })}
      </div>
    </div>
  )
}
