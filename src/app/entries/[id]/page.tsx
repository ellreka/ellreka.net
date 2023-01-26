import { Entries } from '@/components/Entries/Entries'
import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'
import { getAllEntries } from '@/lib/getAllEntries'
import { getEntries } from '@/lib/getEntries'
import { getTags } from '@/lib/getTags'

interface Props {
  params: {
    id: string
  }
}

export const dynamicParams = true

export const generateStaticParams = async () => {
  const entries = await getEntries()
  const tags = getTags(entries)
  const sites = ['zenn', 'ellreka']
  const tagPaths = tags.map((tag) => tag.name)
  const paths = [...sites, ...tagPaths].map((id) => {
    return {
      id
    }
  })
  return paths
}

const EntriesIdPage = async ({ params }: Props) => {
  const { id } = params
  const { entries, tags } = await getAllEntries()
  return (
    <>
      <Meta
        meta={{ title: `${id} | Entries`, description: "ellreka's entries." }}
      />
      <div className="mx-auto h-full max-w-2xl">
        <Title>{`${id} | Entries`}</Title>
        <Entries activeId={id} entries={entries} tags={tags} />
      </div>
    </>
  )
}

export default EntriesIdPage
