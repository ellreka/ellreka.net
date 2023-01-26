import { getTabs } from '@/lib/getTabs'
import { EntriesType } from '@/types'
import { List } from '../List'
import { Tabs } from '../Tabs/Tabs'

type Props = {
  activeId: string | undefined
  entries: EntriesType
  tags: {
    name: string
    count: number
  }[]
}

export const Entries = ({ activeId, entries, tags }: Props) => {
  const filteringEntries = entries.filter((entry) => {
    if (activeId === 'all') {
      return true
    }
    if (activeId) {
      return entry.site === activeId || entry.meta.tags.includes(activeId)
    }
    return true
  })
  const tabs = getTabs({ entries, tags })
  return (
    <div className="mx-auto max-w-2xl">
      <div className="my-4 flex flex-col gap-4 sm:my-8 sm:gap-8">
        <Tabs activeId={activeId} tabs={tabs} />
        <div className="animate-fade-in">
          <List entries={filteringEntries} />
        </div>
      </div>
    </div>
  )
}
