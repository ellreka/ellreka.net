import { getAllEntries } from '@/lib/getAllEntries'
import { Entries } from '@/components/Entries/Entries'
import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'

type Props = {}

const EntriesPage = async ({}: Props) => {
  const { entries, tags } = await getAllEntries()
  return (
    <>
      <Meta meta={{ title: 'Entries', description: "ellreka's entries." }} />
      <div className="mx-auto h-full max-w-2xl">
        <Title>Entries</Title>
        <Entries activeId={'all'} entries={entries} tags={tags} />
      </div>
    </>
  )
}

export default EntriesPage
