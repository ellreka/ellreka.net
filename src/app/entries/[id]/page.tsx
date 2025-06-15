import { Entries } from '@/components/Entries/Entries'
import { Title } from '@/components/Title'
import { getAllEntries } from '@/lib/getAllEntries'
import { getEntries } from '@/lib/getEntries'
import { getTags } from '@/lib/getTags'
import { Metadata } from 'next'

interface Props {
  params: Promise<{
    id: string
  }>
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  
  return {
    title: `${decodedId} | Entries | ellreka.net`,
    description: `Entries tagged with ${decodedId}`,
    openGraph: {
      title: `${decodedId} | Entries | ellreka.net`,
      description: `Entries tagged with ${decodedId}`,
      type: 'website',
      url: `https://ellreka.net/entries/${id}`,
      siteName: 'ellreka.net',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedId} | Entries | ellreka.net`,
      description: `Entries tagged with ${decodedId}`,
    },
  }
}

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
      <div className="mx-auto h-full max-w-2xl">
        <Title>{`${decodedId} | Entries`}</Title>
        <Entries activeId={decodedId} entries={entries} tags={tags} />
      </div>
    </>
  )
}

export default EntriesIdPage
