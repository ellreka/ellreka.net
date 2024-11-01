import { ZennArticleResponse } from '@/types'
import dayjs from 'dayjs'

export const fetchZennArticles = async () => {
  const res = await fetch(
    `https://zenn.dev/api/articles?username=ellreka&count=96&order=latest`,
    {
      next: {
        // 1day
        revalidate: 60 * 60 * 24
      }
    }
  )
  const json: ZennArticleResponse = await res.json()
  return json.articles.map((article: any) => {
    return {
      url: `https://zenn.dev/ellreka/articles/${article.slug}`,
      site: 'zenn',
      meta: {
        title: article.title,
        date: dayjs(new Date(article.published_at)).format('YYYY-MM-DD'),
        tags: [] as string[]
      }
    }
  })
}
