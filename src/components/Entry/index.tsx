import React from 'react'
import { Meta } from '../Meta'
import { MetaType } from '../../types'
import { MDXProvider } from '@mdx-js/react'
// import { useWindowScroll } from 'react-use'
import clsx from 'clsx'

type Props = {
  meta: MetaType
}

const components = {
  h2: (props: any) => {
    return (
      <h2
        className="text-xl mt-12 mb-4 font-medium border-l-4 border-solid border-blue-300 pl-2 text-black dark:text-white"
        id={props.children}
        {...props}
      />
    )
  },
  h3: (props: any) => {
    return (
      <h3
        className="text-lg mt-4 mb-4 font-medium text-black dark:text-white"
        id={props.children}
        {...props}
      />
    )
  },
  p: (props: any) => (
    <p
      className="text-sm leading-8 my-4 text-black dark:text-white"
      {...props}
    />
  ),
  img: (props: any) => <img className="w-auto h-auto" {...props} />,
  a: (props: any) => <a className="text-blue-500" {...props} />,
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
      className="bg-gray-200 dark:bg-gray-800 text-black dark:text-orange-500 border border-solid border-gray-500 dark:border-gray-900 rounded-sm px-2 py-1 mx-1 break-all"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <>
      <blockquote
        className="relative bg-gray-200 dark:bg-gray-700 whitespace-pre-wrap text-gray-600 dark:text-gray-400 py-2 px-3 h-full border-l-4 border-solid border-gray-600"
        {...props}
      />
    </>
  )
}

export const EntryLayout: React.FC<Props> = ({ meta, children }) => {
  // const { y } = useWindowScroll()
  const y = 100
  return (
    <div className="relative">
      <Meta meta={meta}>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </Meta>
      <div className={clsx('border-b-4 border-dotted border-blue-300 pb-12')}>
        <h1 className="text-xl dark:text-white">{meta.title}</h1>
        <div className={clsx('mt-4 flex items-center')}>
          <p className="text-base text-gray-600 dark:text-gray-300">
            created at: {meta.date}
          </p>
          <a
            href={`https://github.com/ellreka/ellreka.net/commits/master/docs/${meta.id}.mdx`}
            target="_blank"
            className="text-base text-blue-500 ml-4">
            history
          </a>
        </div>
        <div className={clsx('flex items-center mt-4')}>
          <p className="text-black dark:text-white">Tags:</p>
          <ul>
            {meta.tags.map((tag, idx) => (
              <li
                key={idx}
                className="inline-block bg-gray-700 px-2 text-white rounded-full ml-3 font-medium">
                <a href="#">{tag}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <div className="w-full">
        <div
          className={clsx(
            ' bg-white border-b-4 border-dotted border-blue-300 flex justify-between items-center transform transition-transform duration-300 ease-in',
            y < 320 ? 'fixed top-0 -translate-y-full' : 'sticky translate-y-0'
          )}>
          <h1 className="text-2xl">{meta.title}</h1>
          <div className="flex">
            <p className="text-base text-gray-600">updated at: {meta.date}</p>
            <a
              href="#"
              target="_blank"
              className="text-base text-blue-500 ml-4">
              history
            </a>
          </div>
          <div className="flex items-center">
            <p>Tags:</p>
            <ul>
              {meta.tags.map((tag, idx) => (
                <li
                  key={idx}
                  className="inline-block bg-gray-700 px-2 text-white rounded-full ml-3">
                  <a href="#">{tag}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div> */}
      <div className="mt-12">
        <MDXProvider components={components}>{children}</MDXProvider>
      </div>
    </div>
  )
}
