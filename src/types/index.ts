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

export type ZennArticleResponse = {
  articles: {
    id: number
    post_type: string
    title: string
    slug: string
    published: boolean
    comments_count: number
    liked_count: number
    body_letters_count: number
    article_type: string
    emoji: string
    is_suspending_private: boolean
    published_at: string
    body_updated_at: string
    source_repo_updated_at: string
    path: string
    user: {
      id: number
      username: string
      name: string
      avatar_small_url: string
    }
    publication: null
  }[]
  next_cursor: null
}

export type EntriesType = {
  url: string
  site: string
  meta: MetaType
}[]
