import { Feed } from 'feed'
import dayjs from 'dayjs'
import { getEntries } from './getEntries'

export const generateFeed = async () => {
  const baseUrl = 'https://ellreka.net'

  const feed = new Feed({
    title: 'ellreka.net',
    description: 'Personal website of ellreka.',
    id: baseUrl,
    link: baseUrl,
    language: 'ja',
    copyright: `© ellreka`,
    updated: dayjs().toDate(),
    author: {
      name: 'ellreka'
    },
    feed: `${baseUrl}/feed`
  })

  const entries = await getEntries()

  entries.forEach((entry) => {
    const url = `${baseUrl}/entry/${entry.slug}`
    feed.addItem({
      title: entry.meta.title,
      description: '',
      link: url,
      id: url,
      date: dayjs(entry.meta.date).toDate()
    })
  })

  return feed.rss2()
}
