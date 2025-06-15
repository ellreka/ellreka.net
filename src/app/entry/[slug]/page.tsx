import fs from 'fs'
import { compile, evaluateSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import path from 'path'
import { Adsense } from '@/components/Adsense'

import { EntryLayout } from '@/components/Entry'
import { RelatedEntry } from '@/components/RelatedEntry'
import { Sidebar } from '@/components/Sidebar'
import { getEntries } from '@/lib/getEntries'
import { MetaType, EntryType } from '@/types'
import rehypePrettyCode from 'rehype-pretty-code' // 追加
import { MDXContent } from '@/components/MDXContent/MDXContent'
import { generateOgp } from '@/lib/generateOgp'
import { notFound } from 'next/navigation'
import { createArticleStructuredData } from '@/lib/structured-data'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Metadata } from 'next'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const root = process.cwd()
const docs = path.join(root, 'docs')

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getData(slug)
  
  if (!data) {
    return {
      title: 'Not Found',
    }
  }
  
  const { frontMatter } = data
  const { meta } = frontMatter
  const imageUrl = meta.ogpImage
    ? `https://ellreka.net${meta.ogpImage}`
    : `https://ellreka.net/ogp/${slug}.png`
  
  return {
    title: `${meta.title} | ellreka.net`,
    description: meta.description || meta.title,
    openGraph: {
      title: meta.title,
      description: meta.description || meta.title,
      type: 'article',
      publishedTime: meta.date,
      authors: ['ellreka'],
      tags: meta.tags,
      url: `https://ellreka.net/entry/${slug}`,
      siteName: 'ellreka.net',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description || meta.title,
      images: [imageUrl],
    },
  }
}

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
    
    const mdx = fs.readFileSync(mdxPath, {
      encoding: 'utf-8'
    })
    
    // Properly evaluate MDX to extract metadata
    let meta: MetaType = { title: '', date: '', tags: [] }
    
    try {
      const evaluated = evaluateSync(mdx, {
        ...runtime,
        development: false,
        baseUrl: import.meta.url
      })
      
      if (evaluated.meta) {
        meta = evaluated.meta as MetaType
      }
    } catch (error) {
      console.error(`Error evaluating MDX from ${slug}:`, error)
    }
    
    // Extract headings from MDX content
    const headingMatches = mdx.match(/^#{1,6}\s+.+$/gm) || []
    const headings = headingMatches.map((heading) => {
      const levelMatch = heading.match(/^(#{1,6})\s+(.+)$/)
      if (levelMatch) {
        return {
          level: levelMatch[1].length,
          title: levelMatch[2].trim()
        }
      }
      return null
    }).filter((h): h is { level: number; title: string } => h !== null)

    /** @type {import('rehype-pretty-code').Options} */
    const options = {
      theme: 'ayu-dark',
      keepBackground: false
    }

    const compiled = await compile(mdx, {
      outputFormat: 'function-body',
      rehypePlugins: [[rehypePrettyCode, options]]
    })

    const code = compiled.toString()

    await generateOgp({ slug, title: meta.title })

    return {
      code,
      frontMatter: {
        meta,
        headings
      },
      entries: entries
        .filter((entry) =>
          entry.meta.tags.some((tag: string) => meta.tags.includes(tag))
        )
        .filter((entry) => entry.slug !== slug)
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

const Post = async ({ params }: Props) => {
  const { slug } = await params
  const data = await getData(slug)

  if (data == null) {
    return notFound()
  }

  const { code, frontMatter, entries } = data
  const { meta, headings } = frontMatter
  
  const articleStructuredData = createArticleStructuredData({
    title: meta.title,
    date: meta.date,
    description: meta.description || meta.title,
    tags: meta.tags,
    slug,
    ogpImage: meta.ogpImage
      ? `https://ellreka.net${meta.ogpImage}`
      : `https://ellreka.net/ogp/${slug}.png`
  });
  
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Entries', href: '/entries' },
    { name: meta.title }
  ];
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <div className="mx-auto mt-10 flex max-w-screen-xl justify-between gap-x-5">
        <div className="w-full flex-1 lg:w-0">
          <Breadcrumb items={breadcrumbItems} />
          <EntryLayout slug={slug} meta={meta}>
            <MDXContent code={code} />
          </EntryLayout>
          {entries.length > 0 && (
            <div className="mt-20">
              <RelatedEntry entries={entries} />
            </div>
          )}
        </div>
        <div className="hidden w-56 lg:block">
          <Sidebar headings={headings} />
        </div>
      </div>
      <div className="mt-10">{/* <Adsense /> */}</div>
    </>
  )
}

export default Post
