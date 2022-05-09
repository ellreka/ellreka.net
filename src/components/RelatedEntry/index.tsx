import { FC } from 'react'
import { EntryType } from '../../types'
import Image from 'next/image'

interface Props {
  entries: EntryType[]
}

export const RelatedEntry: FC<Props> = ({ entries }) => {
  return (
    <div>
      <div className="text-lg font-bold text-white">Related Entries</div>
      <div className="mt-5 grid gap-x-3 gap-y-5 md:grid-cols-2">
        {entries.map((entry) => {
          return (
            <a
              key={entry.slug}
              href={`/entry/${entry.slug}`}
              className=" relative block h-auto w-full overflow-hidden rounded-md shadow-inner">
              <span className="text-blue-400 hover:text-blue-600">
                {entry.meta.title}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
