import { Entries } from '@/components/Entries/Entries'
import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'
import { getAllEntries } from '@/lib/getAllEntries'
import { getEntries } from '@/lib/getEntries'
import { getTags } from '@/lib/getTags'

interface Props {
  params: Promise<{
    id: string
  }>
}

export const dynamicParams = true

export const generateStaticParams = async () => {
  const entries = await getEntries()
  const tags = getTags(entries)
  const sites = ['zenn', 'ellreka']
  const tagPaths = tags.map((tag) => tag.name)
  const paths = [...sites, ...tagPaths].map((id) => {
    return {
      id: encodeURIComponent(id)
    }
  })
  return paths
}

const EntriesIdPage = async ({ params }: Props) => {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const { entries, tags } = await getAllEntries()
  return (
    <>
      <Meta
        meta={{ title: `${decodedId} | Entries`, description: "ellreka's entries." }}
      />
      <div className="mx-auto h-full max-w-2xl">
        <Title>{`${decodedId} | Entries`}</Title>
        <Entries activeId={decodedId} entries={entries} tags={tags} />
      </div>
    </>
  )
}

export default EntriesIdPage
