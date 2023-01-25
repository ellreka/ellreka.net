import Link from 'next/link'
import { FC } from 'react'

interface Props {
  tags: Array<{
    name: string
    count: number
  }>
}

export const Tags: FC<Props> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-y-2 gap-x-1">
      {tags.map((tag) => (
        <Link
          href={`/tag/${tag.name}`}
          key={tag.name}
          className="ml-1 inline-block rounded-full bg-gray-700 px-2 text-xs text-white md:text-sm">
          {tag.name}({tag.count})
        </Link>
      ))}
    </div>
  )
}
