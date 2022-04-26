export interface MetaType {
  id: string
  title: string
  description?: string
  date: string
  tags: string[]
}

export type Timeline = Array<{
  date: string
  type: string
  title: string
  url: string
}>
