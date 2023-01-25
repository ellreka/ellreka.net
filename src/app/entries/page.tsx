import { List } from '@/components/List'
import { Title } from '@/components/Title'
import { getEntries } from '@/lib/getEntries'
import { Meta } from '@/components/Meta'
import { Tags } from '@/components/Tags/Tags'
import { getTags } from '@/lib/getTags'

const getData = async () => {
  const entries = await getEntries()
  const tags = getTags(entries)
  return {
    entries,
    tags
  }
}

const Home = async () => {
  const { entries, tags } = await getData()
  return (
    <>
      <Meta
        meta={{
          title: 'Entries',
          description: "ellreka's entries."
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>Entries</Title>
        <div className="my-4 flex flex-col gap-4 sm:my-8 sm:gap-8">
          <Tags tags={tags} />
          <List entries={entries} />
        </div>
      </div>
    </>
  )
}

export default Home
