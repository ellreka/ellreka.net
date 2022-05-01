import React, { FC } from 'react'

type Props = {
  title: string
  image: string
  description: string
  url: string
  domain: string
}

export const BlogCard: FC<Props> = ({
  title,
  image,
  url,
  description,
  domain
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="my-4 flex max-h-[150px] items-center justify-between gap-2 rounded-md border border-gray-400 bg-slate-700 py-4 px-4 hover:bg-slate-800">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
        <p className="flex items-center gap-1 text-xs text-white">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}`}
            alt=""
          />
          <span>{domain}</span>
        </p>
      </div>
      <div className="h-[80px] w-auto flex-shrink-0">
        <img className="h-full w-auto" src={image} alt="" />
      </div>
    </a>
  )
}
