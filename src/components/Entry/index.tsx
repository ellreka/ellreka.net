import { MDXProvider, MDXProviderComponentsProp } from '@mdx-js/react'
// import { useWindowScroll } from 'react-use'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

import { MetaType } from '../../types'
import { Meta } from '../Meta'

interface Props {
  meta: MetaType
  children: React.ReactNode
}

const components: MDXProviderComponentsProp = {
  h2: (props) => {
    return (
      <h2
        className="mb-4 mt-12 pl-2 text-black dark:text-white text-xl font-medium border-l-4 border-solid border-blue-300"
        id={props.children}
        {...props}>
        {props.children}
      </h2>
    )
  },
  h3: (props: any) => {
    return (
      <h3
        className="mb-4 mt-4 text-black dark:text-white text-lg font-medium"
        id={props.children}
        {...props}>
        {props.children}
      </h3>
    )
  },
  p: (props: any) => (
    <p
      className="my-4 text-black dark:text-white text-sm leading-8"
      {...props}
    />
  ),
  img: (props: any) => (
    <img className="w-auto h-auto" alt={props.alt} {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-500 break-all" href={props.href} {...props}>
      {props.children}
    </a>
  ),
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
    <strong className="text-black dark:text-white font-bold" {...props} />
  ),
  inlineCode: (props: any) => (
    <code
      className="mx-1 px-2 py-1 text-black dark:text-orange-500 break-all bg-gray-200 dark:bg-gray-800 border border-solid border-gray-500 dark:border-gray-900 rounded-sm"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <>
      <blockquote
        className="relative px-3 py-2 h-full dark:text-gray-400 text-gray-600 whitespace-pre-wrap bg-gray-200 dark:bg-gray-700 border-l-4 border-solid border-gray-600"
        {...props}
      />
    </>
  )
}

export function EntryLayout({ meta, children }: Props): React.ReactElement {
  // const { y } = useWindowScroll()
  // const y = 100
  return (
    <div className="relative">
      <Meta meta={meta}>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </Meta>
      <div className={clsx('pb-12 border-b-4 border-dotted border-blue-300')}>
        <h1 className="dark:text-white text-xl">{meta.title}</h1>
        <div className={clsx('flex items-center mt-4')}>
          <p className="dark:text-gray-300 text-gray-600 text-base">
            created at: {meta.date}
          </p>
          <a
            href={`https://github.com/ellreka/ellreka.net/commits/master/docs/${meta.id}.mdx`}
            target="_blank"
            rel="noreferrer"
            className="ml-4 text-blue-500 text-base">
            history
          </a>
        </div>
        <div className={clsx('flex items-center mt-4')}>
          <p className="text-black dark:text-white">Tags:</p>
          <ul>
            {meta.tags.map((tag, idx) => (
              <li
                key={idx}
                className="inline-block ml-3 px-2 text-white bg-gray-700 rounded-full">
                <Link href={`/tag/${tag}`}>
                  <a>{tag}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12">
        <MDXProvider components={components}>{children}</MDXProvider>
      </div>
    </div>
  )
}
