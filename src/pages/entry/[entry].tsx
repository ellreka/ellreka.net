import React from 'react'
import Layout from '../../components/Layout'
import { Sidebar } from '../../components/Sidebar'
import { EntryLayout } from '../../components/Entry'
import MDXContent, { meta } from '../../../docs/test.mdx'

type Props = {
  meta: any
}

const Post: React.FC<Props> = () => {
  return (
    <Layout>
      <div
        className="mt-24 grid grid-flow-col grid-cols-6 gap-4 mx-auto"
        style={{ width: 'calc(100% - 120px)' }}>
        <div className="col-span-5">
          <EntryLayout meta={meta}>
            <MDXContent />
          </EntryLayout>
        </div>
        <div className="col-span-1 bg-blue-200 h-full">
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
