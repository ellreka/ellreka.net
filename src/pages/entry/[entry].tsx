import React from 'react'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'
import { EntryLayout } from '../../components/Entry'
import MDXContent, { meta } from '../../../docs/test.mdx'
import { MDXProvider } from '@mdx-js/react'

type Props = {
  meta: any
}

const Post: React.FC<Props> = () => {
  const [toc, setToc] = React.useState('uuu')

  const components = {
    h2: (props: any) => {
      return (
        <h2
          className="text-xl mt-12 mb-4 font-medium border-l-4 border-solid border-blue-300 pl-2"
          {...props}
        />
      )
    },
    h3: (props: any) => {
      return (
        <h3
          className="text-lg mt-4 mb-4 font-medium"
          id={props.children}
          {...props}
        />
      )
    },
    p: (props: any) => <p className="text-sm leading-8 mt-4" {...props} />,
    img: (props: any) => <img className="w-1/2" {...props} />,
    a: (props: any) => <a className="text-blue-500" {...props} />,
    ul: (props: any) => <ul className="list" {...props} />,
    li: (props: any) => (
      <li className="relative mb-2" {...props}>
        <span className="mr-2">-</span>
        {props.children}
      </li>
    ),
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
  return (
    <Layout>
      <div
        className="mt-24 grid grid-flow-col grid-cols-6 gap-4 mx-auto"
        style={{ width: 'calc(100% - 120px)' }}>
        <div className="col-span-5">
          <EntryLayout meta={meta}>
            <MDXProvider components={components}>
              <MDXContent />
            </MDXProvider>
          </EntryLayout>
        </div>
        <div className="col-span-1 h-full">
          <Sidebar
            list={[
              {
                title: 'Heading2',
                children: [
                  {
                    title: 'Heading3'
                  },
                  {
                    title: 'Heading3'
                  },
                  {
                    title: 'Heading3'
                  }
                ]
              },
              {
                title: 'Heading2',
                children: []
              }
            ]}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Post
