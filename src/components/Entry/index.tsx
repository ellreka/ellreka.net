import { MDXProviderComponentsProp } from '@mdx-js/react'
// import { useWindowScroll } from 'react-use'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

import { MetaType } from '../../types'
import { BlogCard } from '../BlogCard'
import { Image } from '../Image/Image'
import { Meta } from '../Meta'

interface Props {
  meta: MetaType
  slug: string
  children: React.ReactNode
}

export const mdxComponents: MDXProviderComponentsProp = {
  h2: (props: any) => {
    return (
      <h2
        className="mb-4 mt-12 border-l-4 border-solid border-blue-300 pl-2 text-xl font-medium text-black dark:text-white"
        id={props.children}
        {...props}>
        {props.children}
      </h2>
    )
  },
  h3: (props: any) => {
    return (
      <h3
        className="mb-4 mt-4 inline-block border-b-2 border-solid border-blue-300 text-lg font-medium text-black dark:text-white"
        id={props.children}
        {...props}>
        {props.children}
      </h3>
    )
  },
  p: (props: any) => (
    <div
      className="sm:text-md my-4 text-sm leading-8 text-black dark:text-white"
      {...props}
    />
  ),
  img: (props: any) => (
    <Image className="h-auto w-auto" alt={props.alt} {...props} />
  ),
  a: (props: any) => {
    return props.href === props.children || props.children == null ? (
      <BlogCard {...props} />
    ) : (
      <a className="break-all text-blue-500" href={props.href} {...props}>
        {props.children}
      </a>
    )
  },
  ul: (props: any) => (
    <ul className="list text-black dark:text-white" {...props} />
  ),
  li: (props: any) => (
    <li className="relative mb-2 text-black dark:text-white" {...props}>
      <span className="mr-2 text-black dark:text-white">-</span>
      {props.children}
    </li>
  ),
  strong: (props: any) => (
    <strong className="font-bold text-black dark:text-white" {...props} />
  ),
  inlineCode: (props: any) => (
    <code
      className="mx-1 break-all rounded-sm border border-solid border-gray-500 bg-gray-200 px-2 py-1 text-black dark:border-gray-900 dark:bg-gray-800 dark:text-orange-500"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <>
      <blockquote
        className="relative h-full border-l-4 border-solid border-gray-600 bg-gray-200 px-3 py-2 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
        {...props}
      />
    </>
  ),
  Image: Image
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
      <Meta
        meta={{
          title: meta.title,
          description: meta.title,
          image: meta.ogpImage
            ? `https://ellreka.net${meta.ogpImage}`
            : `https://ellreka.net/ogp/${slug}.png`
        }}
        isEntry={true}>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </Meta>
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
          <p className="text-black dark:text-white">Tags:</p>
          <ul className="inline-flex flex-wrap items-center gap-1">
            {meta.tags.map((tag, idx) => (
              <li
                key={idx}
                className="inline-block rounded-full bg-gray-700 px-2 text-white">
                <Link
                  href={{
                    pathname: '/tag/[tag]',
                    query: { tag }
                  }}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12">{children}</div>
    </div>
  )
}
