import fs from 'fs'
import { compile } from '@mdx-js/mdx'
import path from 'path'
import { Adsense } from '@/components/Adsense'

import { EntryLayout } from '@/components/Entry'
import { RelatedEntry } from '@/components/RelatedEntry'
import { Sidebar } from '@/components/Sidebar'
import { getEntries } from '@/lib/getEntries'

// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism'
import { MDXContent } from '@/components/MDXContent/MDXContent'
import { generateOgp } from '@/lib/generateOgp'

interface Params {
  params: {
    slug: string
  }
}

const root = process.cwd()
const docs = path.join(root, 'docs')

export const dynamicParams = false

export const generateStaticParams = async () => {
  const allDirents = fs.readdirSync(docs, { withFileTypes: true })
  const paths = allDirents
    .filter((dirent) => dirent.isFile())
    .map(({ name }) => {
      return {
        slug: name.replace(/\.mdx/, '')
      }
    })
  return paths
}

const getData = async (slug: string) => {
  const entries = await getEntries()
  const mdxPath = path.join(docs, `${slug}.mdx`)

  const { meta, headings } = await import(`../../../../docs/${slug}.mdx`)
  const mdx = fs.readFileSync(mdxPath, {
    encoding: 'utf-8'
  })

  const compiled = await compile(mdx, {
    outputFormat: 'function-body',
    useDynamicImport: true,
    rehypePlugins: [rehypePrism]
  })

  const code = compiled.toString()

  // await generateOgp({ slug, title: meta.title })
  return {
    code,
    frontMatter: {
      meta,
      headings
    },
    entries: entries
      .filter((entry) => entry.meta.tags.some((tag) => meta.tags.includes(tag)))
      .filter((entry) => entry.slug !== slug)
  }
}

const Post = async ({ params: { slug } }: Params) => {
  const { code, frontMatter, entries } = await getData(slug)
  const { meta, headings } = frontMatter

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-screen-xl justify-between">
        <div className="w-full lg:w-4/5">
          <EntryLayout slug={slug} meta={meta}>
            <MDXContent code={code} />
          </EntryLayout>
          {entries.length && (
            <div className="mt-20">
              <RelatedEntry entries={entries} />
            </div>
          )}
        </div>
        <div className="ml-6 hidden min-w-56 lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
      <div className="mt-10">
        <Adsense />
      </div>
    </>
  )
}

export default Post
