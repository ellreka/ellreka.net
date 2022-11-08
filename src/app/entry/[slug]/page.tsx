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
import { Meta } from '@/components/Meta'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

const root = process.cwd()
const docs = path.join(root, 'docs')

export const dynamicParams = true

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
  try {
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

    try {
      await generateOgp({ slug, title: meta.title })
    } catch (e) {
      console.error(e)
    }

    return {
      code,
      frontMatter: {
        meta,
        headings
      },
      entries: entries
        .filter((entry) =>
          entry.meta.tags.some((tag) => meta.tags.includes(tag))
        )
        .filter((entry) => entry.slug !== slug)
    }
  } catch (e) {
    console.error(e)
  }
}

const Post = async ({ params }: Props) => {
  const { slug } = params
  const data = await getData(slug)

  if (data == null) {
    return notFound()
  }

  const { code, frontMatter, entries } = data
  const { meta, headings } = frontMatter
  return (
    <>
      <Meta
        meta={{
          title: meta.title,
          description: meta.title,
          image: meta.ogpImage
            ? `https://ellreka.net${meta.ogpImage}`
            : `https://ellreka.net/ogp/${slug}.png`
        }}
        isEntry={true}>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </Meta>
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
