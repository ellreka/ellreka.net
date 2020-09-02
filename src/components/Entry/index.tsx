import React from 'react'
import Head from 'next/head'
// import { useWindowScroll } from 'react-use'
import clsx from 'clsx'

type Props = {
  meta: any
}

export const EntryLayout: React.FC<Props> = ({ meta, children }) => {
  // const { y } = useWindowScroll()
  const y = 100
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
            <p className="text-base text-gray-600">created at: {meta.date}</p>
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
        <div className="mt-32">{children}</div>
      </div>
    </>
  )
}
