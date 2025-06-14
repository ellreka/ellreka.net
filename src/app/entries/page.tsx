import { getAllEntries } from '@/lib/getAllEntries'
import { Entries } from '@/components/Entries/Entries'
import { Title } from '@/components/Title'
import { Metadata } from 'next'

type Props = {}

export const metadata: Metadata = {
  title: 'Entries | ellreka.net',
  description: "ellreka's entries.",
  openGraph: {
    title: 'Entries | ellreka.net',
    description: "ellreka's entries.",
    type: 'website',
    url: 'https://ellreka.net/entries',
    siteName: 'ellreka.net',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Entries | ellreka.net',
    description: "ellreka's entries.",
  },
}

const EntriesPage = async ({}: Props) => {
  const { entries, tags } = await getAllEntries()
  
  return (
    <>
      <div className="mx-auto h-full max-w-2xl">
        <Title>Entries</Title>
        <Entries activeId={'all'} entries={entries} tags={tags} />
      </div>
    </>
  )
}

export default EntriesPage
