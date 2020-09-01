import React from 'react'
import { EntryLayout } from '../../components/Entry'
import MDXContent, { meta } from '../../../docs/test.mdx'

type Props = {
  meta: any
}

const Post: React.FC<Props> = () => {
  return (
    <div>
      <h1>aaaa</h1>
      <EntryLayout meta={meta}>
        <MDXContent />
      </EntryLayout>
    </div>
  )
}

export default Post
