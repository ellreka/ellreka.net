import { List } from '@/components/List'
import { Meta } from '@/components/Meta'
import { Tags } from '@/components/Tags/Tags'
import { Title } from '@/components/Title'
import { getEntries } from '@/lib/getEntries'
import { getTags } from '@/lib/getTags'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

export const dynamicParams = true

export const generateStaticParams = async () => {
  const entries = await getEntries()
  const tags = entries.flatMap((entry) => entry.meta.tags)
  const paths = Array.from(new Set(tags)).map((tag) => {
    return {
      slug: tag
    }
  })
  return paths
}

const getData = async (slug: string) => {
  const entries = await getEntries()
  const tags = getTags(entries)
  const filteringEntries = entries.filter((entry) => {
    return entry.meta.tags.includes(slug)
  })
  return {
    entries: filteringEntries,
    tags
  }
}

const Tag = async ({ params }: Props) => {
  const { slug } = params
  const { entries, tags } = await getData(slug)

  if (entries.length <= 0) {
    return notFound()
  }

  return (
    <>
      <Meta
        meta={{
          title: `${slug} | Entries`,
          description: `${slug} | Entries`
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>{slug}</Title>
        <div className="my-4 flex flex-col gap-4 sm:my-8 sm:gap-8">
          <Tags tags={tags} />
          <List entries={entries} />
        </div>
      </div>
    </>
  )
}

export default Tag
