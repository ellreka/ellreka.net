// import fs from 'fs'
// import matter from 'gray-matter'
// import path from 'path'
import React from 'react'

import Layout from '../../components/Layout'
// import { List } from '../../components/List'
// import { Title } from '../../components/Title'
import { MetaType } from '../../types'

// const root = process.cwd()

interface Props {
  entries: Array<{
    slug: string
    frontMatter: MetaType
  }>
}

// export const getStaticProps = async () => {
//   const docs = path.join(root, 'docs')
//   const entries = fs.readdirSync(docs).map((p) => {
//     const content = fs.readFileSync(path.join(docs, p), 'utf8')
//     return {
//       slug: p.replace(/\.mdx/, ''),
//       frontMatter: matter(content).data
//     }
//   })
//   return { props: { entries } }
// }

const Tag: React.FC<Props> = (props) => {
  console.log(props)
  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        {/* <Title>Entries</Title>
        <List entries={entries} /> */}
      </div>
    </Layout>
  )
}

export default Tag
