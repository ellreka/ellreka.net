import { List } from '@/components/List'
import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'
import { getEntries } from '@/lib/getEntries'

interface Props {
  params: {
    tag: string
  }
}

export const generateStaticParams = async () => {
  const entries = await getEntries()
  const tags = entries.flatMap((entry) => entry.meta.tags)
  const paths = Array.from(new Set(tags)).map((tag) => {
    return {
      tag: tag
    }
  })
  return paths
}

const Tag = async ({ params: { tag } }: Props) => {
  const entries = await getEntries()
  const filteringEntries = entries.filter((entry) => {
    return entry.meta.tags.includes(tag)
  })
  return (
    <>
      <Meta
        meta={{
          title: `「${tag}」一覧`,
          description: `「${tag}」一覧`
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>{tag}</Title>
        <List entries={filteringEntries} />
      </div>
    </>
  )
}

export default Tag
