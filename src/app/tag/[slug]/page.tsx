import { List } from '@/components/List'
import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'
import { getEntries } from '@/lib/getEntries'

interface Props {
  params: {
    slug: string
  }
}

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
  const filteringEntries = entries.filter((entry) => {
    return entry.meta.tags.includes(slug)
  })
  return filteringEntries
}

const Tag = async ({ params: { slug } }: Props) => {
  const entries = await getData(slug)
  return (
    <>
      <Meta
        meta={{
          title: `「${slug}」一覧`,
          description: `「${slug}」一覧`
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>{slug}</Title>
        <List entries={entries} />
      </div>
    </>
  )
}

export default Tag
