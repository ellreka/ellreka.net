import clsx from 'clsx'
import React, { FC } from 'react'
import { useOgp } from '../../hooks/useOgp'

type Props = {
  href: string
}

export const BlogCard: FC<Props> = ({ href }) => {
  const { ogp, isLoading } = useOgp(href)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={clsx(
        'my-4 flex max-h-[150px] items-center justify-between gap-2 rounded-md border border-gray-400 bg-slate-700 py-4 px-4 hover:bg-slate-800',
        isLoading && 'animate-pulse'
      )}>
      <div className="flex grow flex-col gap-2">
        {isLoading ? (
          <div className="h-2 w-10 rounded-full bg-slate-500"></div>
        ) : (
          <p className="text-sm font-semibold text-white">{ogp?.title}</p>
        )}
        {isLoading ? (
          <>
            <div className="h-2 w-[70%] rounded-full bg-slate-500"></div>
            <div className="h-2 w-full rounded-full bg-slate-500"></div>
          </>
        ) : (
          <p className="text-xs text-gray-400">{ogp?.description}</p>
        )}
        {isLoading ? (
          <div className="h-2 w-20 rounded-full bg-slate-500"></div>
        ) : (
          <p className="flex items-center gap-1 text-xs text-white">
            <img
              src={`https://www.google.com/s2/favicons?domain=${ogp?.domain}`}
              alt=""
            />
            <span>{ogp?.domain}</span>
          </p>
        )}
      </div>
      {isLoading ? (
        <div className="h-20 w-20 shrink-0 rounded-md bg-slate-500"></div>
      ) : (
        <div className="hidden h-[80px] w-auto flex-shrink-0 sm:block">
          <img className="h-full w-auto" src={ogp?.image} alt="" />
        </div>
      )}
    </a>
  )
}
