export interface MetaType {
  // id: string
  title: string
  description?: string
  date: string
  tags: string[]
  ogpImage?: string
}

export interface EntryType {
  slug: string
  meta: MetaType
}

export type Timeline = Array<{
  date: string
  type: string
  title: string
  url: string
}>
