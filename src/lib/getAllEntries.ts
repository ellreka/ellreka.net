import dayjs from 'dayjs'
import { fetchZennArticles } from './fetchZennArticles'
import { getEntries } from './getEntries'
import { getTags } from './getTags'

export const getAllEntries = async () => {
  const entries = await getEntries()
  const tags = getTags(entries)
  const formattedEntries = entries.map((entry) => {
    return {
      url: `/entry/${entry.slug}`,
      site: 'ellreka',
      meta: {
        title: entry.meta.title,
        date: dayjs(new Date(entry.meta.date)).format('YYYY/MM/DD'),
        tags: entry.meta.tags
      }
    }
  })

  const zennArticles = await fetchZennArticles()
  const allEntries = [...formattedEntries, ...zennArticles].sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  )

  return {
    entries: allEntries,
    tags
  }
}
