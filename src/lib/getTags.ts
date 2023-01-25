import { MetaType } from '@/types'

export const getTags = (
  entries: {
    slug: string
    meta: MetaType
  }[]
) => {
  const tags = [...new Set(entries.flatMap((entry) => entry.meta.tags))]
    .map((tag) => ({
      name: tag,
      count: entries.filter((entry) => entry.meta.tags.includes(tag)).length
    }))
    .sort((a, b) => b.count - a.count)

  return tags
}
