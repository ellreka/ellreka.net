import React from 'react'
import Head from 'next/head'
import { MDXProvider } from '@mdx-js/react'
import { useWindowScroll } from 'react-use'
import clsx from 'clsx'

type Props = {
  meta: any
}

const components = {
  h2: (props: any) => (
    <h2
      className="text-xl mt-4 mb-4 font-medium border-l-4 border-solid border-blue-300 pl-2"
      id={props.children}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-lg mt-4 mb-4 font-medium"
      id={props.children}
      {...props}
    />
  ),
  p: (props: any) => <p className="text-sm leading-8 mt-4" {...props} />,
  img: (props: any) => <img className="w-1/2" {...props} />,
  a: (props: any) => <a className="text-blue-500" {...props} />,
  ul: (props: any) => <ul className="list" {...props} />,
  li: (props: any) => <li className="relative" {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
  inlineCode: (props: any) => (
    <code
      className="bg-gray-200 border border-solid border-gray-500 rounded-sm px-1"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <>
      <blockquote
        className="relative bg-gray-200 whitespace-pre-wrap text-gray-600 py-2 px-3 h-full border-l-4 border-solid border-gray-600"
        {...props}
      />
    </>
  )
}

export const EntryLayout: React.FC<Props> = ({ meta, children }) => {
  const { y } = useWindowScroll()
  return (
    <>
      <div className="relative">
        <Head>
          <title>{meta.title} | ellreka.net</title>
          <meta name="description" content={meta.description} />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
            rel="stylesheet"
          />
        </Head>
        <div
          className={clsx(
            'bg-white border-b-4 border-dotted border-blue-300 pb-12'
          )}>
          <h1 className="text-3xl">{meta.title}</h1>
          <div className={clsx('mt-4 flex items-center')}>
            <p className="text-base text-gray-600">updated at: {meta.date}</p>
            <a
              href="#"
              target="_blank"
              className="text-base text-blue-500 ml-4">
              history
            </a>
          </div>
          <div className={clsx('flex items-center mt-4')}>
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
        <div className="w-full">
          <div
            className={clsx(
              ' bg-white border-b-4 border-dotted border-blue-300 flex justify-between items-center transform transition-transform duration-300 ease-in',
              y < 320 ? 'fixed top-0 -translate-y-full' : 'sticky translate-y-0'
            )}>
            <h1 className="text-3xl">{meta.title}</h1>
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
        </div>
        <div className="mt-32">
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>
      </div>
      <style>
        {`
          .list li p {
            margin-top: 0;
            margin-left: 10px;
          }
          .list li:before {
            content: '-';
            display: inline-block;
            position: absolute;
            top: 3px;
          }
          .list li strong {
            display: block;
          }
        `}
      </style>
    </>
  )
}
