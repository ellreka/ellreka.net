import React, { FC } from 'react'
import { useOgp } from '../../hooks/useOgp'

type Props = {
  href: string
}

export const BlogCard: FC<Props> = ({ href }) => {
  const { ogp, isLoading } = useOgp(href)
  return (
    <a
      href={ogp?.url}
      target="_blank"
      rel="noreferrer"
      className="my-4 flex max-h-[150px] items-center justify-between gap-2 rounded-md border border-gray-400 bg-slate-700 py-4 px-4 hover:bg-slate-800">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white">{ogp?.title}</p>
        <p className="text-xs text-gray-400">{ogp?.description}</p>
        <p className="flex items-center gap-1 text-xs text-white">
          <img
            src={`https://www.google.com/s2/favicons?domain=${ogp?.domain}`}
            alt=""
          />
          <span>{ogp?.domain}</span>
        </p>
      </div>
      <div className="hidden h-[80px] w-auto flex-shrink-0 sm:block">
        <img className="h-full w-auto" src={ogp?.image} alt="" />
      </div>
    </a>
  )
}
