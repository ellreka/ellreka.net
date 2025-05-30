'use client'

import { runSync } from '@mdx-js/mdx'
import React, { FC, Fragment, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import * as runtime from 'react/jsx-runtime'
import { BlogCard } from '@/components/BlogCard'
import { Image } from '@/components/Image/Image'
import { Link } from '@/components/Link/Link'
import { MDXComponents } from 'mdx/types'
import clsx from 'clsx'

type Props = {
  code: string
}

export const mdxComponents: MDXComponents = {
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
      <div>
        <h3
          className="mb-4 mt-4 inline-flex border-b-2 border-solid border-blue-300 text-lg font-medium text-black dark:text-white"
          id={props.children}
          {...props}>
          {props.children}
        </h3>
      </div>
    )
  },
  p: (props: any) => (
    <div
      className="my-4 text-sm leading-8 text-black dark:text-white sm:text-base"
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
      <a
        className="break-all text-blue-500"
        href={props.href}
        target="_blank"
        rel="noreferrer"
        {...props}>
        {props.children}
      </a>
    )
  },
  ul: (props: any) => {
    return (
      <ul
        className={clsx('list text-sm text-black dark:text-white sm:text-base')}
        {...props}
      />
    )
  },
  ol: (props: any) => {
    return (
      <ol
        className={clsx(
          'list-decimal pl-[1.8em] text-sm text-black dark:text-white sm:text-base'
        )}
        {...props}
      />
    )
  },
  li: (props: any) => (
    <li className="relative mb-2 text-black dark:text-white" {...props}>
      {props.children}
    </li>
  ),
  strong: (props: any) => (
    <strong className="font-bold text-black dark:text-white" {...props} />
  ),
  code: (props: any) => {
    const isCodeBlock = props['data-language'] !== undefined

    if (isCodeBlock) {
      return <code className={props.className} {...props} />
    }

    // インラインコードにのみスタイルを適用
    return (
      <code
        className="mx-1 break-all rounded-md border border-slate-800 bg-slate-800 px-1 py-0.5 text-sky-400"
        {...props}
      />
    )
  },
  blockquote: (props: any) => (
    <>
      <blockquote
        className="relative h-full border-l-4 border-solid border-gray-600 bg-gray-200 px-3 py-2 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
        {...props}
      />
    </>
  ),
  pre: (props: any) => {
    const CodeBlockWithToggle = () => {
      // const [isExpanded, setIsExpanded] = useState(false)

      return (
        <div className="relative">
          <pre
            className={clsx(
              'my-4 overflow-auto rounded-md border border-slate-600 p-[1rem]'
              // isExpanded ? '' : 'max-h-[500px]'
            )}
            {...props}
          />
        </div>
      )
    }

    return <CodeBlockWithToggle />
  },
  figcaption: (props: any) => {
    if (props['data-rehype-pretty-code-title'] !== undefined) {
      return (
        <figcaption
          className="inline-block rounded-t-md border border-b-0 border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-500"
          {...props}
        />
      )
    }
    // 通常の figcaption
    return <figcaption {...props} />
  },
  Image: Image,
  Link: Link
}

export const MDXContent: FC<Props> = ({ code }) => {
  const { default: Content } = runSync(code, {
    ...runtime,
    Fragment
  })

  return <Content components={mdxComponents} />
}
