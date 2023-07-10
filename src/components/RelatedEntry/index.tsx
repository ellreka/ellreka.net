import { FC } from 'react'
import { EntryType } from '../../types'
import NextLink from 'next/link'

interface Props {
  entries: EntryType[]
}

export const RelatedEntry: FC<Props> = ({ entries }) => {
  return (
    <div>
      <div className="text-lg font-bold text-white">Related Entries</div>
      <div className="mt-5 flex flex-col gap-5">
        {entries.map((entry) => {
          return (
            <NextLink
              key={entry.slug}
              href={`/entry/${entry.slug}`}
              className="relative block h-auto w-full overflow-hidden rounded-md shadow-inner">
              <span className="text-blue-400 hover:text-blue-600">
                {entry.meta.title}
              </span>
            </NextLink>
          )
        })}
      </div>
    </div>
  )
}
