import { Meta } from '@/components/Meta'
import { Title } from '@/components/Title'
import timelineJson from '@/timeline.json'
import { getEntries } from '@/lib/getEntries'
import { Timeline } from '@/types'
import dayjs from 'dayjs'

const fetchZennArticles = async (): Promise<Timeline> => {
  const res = await fetch(
    `https://zenn.dev/api/articles?username=ellreka&count=96&order=latest`
  )
  const json = await res.json()
  return json.articles.map((article: any) => {
    return {
      title: article.title,
      type: 'post',
      date: article.published_at,
      url: `https://zenn.dev/ellreka/articles/${article.slug}`
    }
  })
}

const getData = async () => {
  const entries = await getEntries()
  const posts: Timeline = entries.map((entry) => {
    return {
      date: entry.meta.date,
      type: 'post',
      title: entry.meta.title,
      url: `https://ellreka.net/entry/${entry.slug}`
    }
  })

  const zennArticles = await fetchZennArticles()

  const timeline = [...timelineJson.items, ...posts, ...zennArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const years = Array.from(
    new Set(timeline.map((i) => new Date(i.date).getFullYear()))
  ).sort((a, b) => b - a)

  return { timeline, years }
}

const Timeline = async () => {
  const { timeline, years } = await getData()
  return (
    <>
      <Meta meta={{ title: 'Timeline', description: 'タイムライン' }} />
      <div className="mx-auto h-full max-w-2xl animate-fade-in">
        <Title>Timeline</Title>
        <div className="mt-10 flex h-full flex-col gap-10">
          {years.map((year) => {
            return (
              <div key={year} className="">
                <p className="ml-3 text-lg font-bold text-white">{year}</p>
                <div className="mt-5 flex h-full w-full">
                  <div className="mx-5 w-[3px] rounded-full bg-gray-700"></div>
                  <div className="flex w-full flex-col gap-y-8">
                    {timeline
                      .filter((i) => new Date(i.date).getFullYear() === year)
                      .map((item, key) => {
                        return (
                          <div key={key} className="relative">
                            <span className="absolute top-0 left-[-30px] h-[20px] w-[20px] rounded-full">
                              <img
                                className="h-full w-full rounded-full"
                                src={`https://www.google.com/s2/favicons?domain=${item.url}`}
                                alt=""
                              />
                            </span>
                            <div className="relative flex flex-col gap-1">
                              <p className=" text-sm italic text-gray-300">
                                {item.type === 'post' && 'Posted'}
                                {item.type === 'release' && 'Released'}
                              </p>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex w-full flex-col gap-1 rounded-md bg-gray-700 px-5 py-3 transition-colors duration-150 hover:bg-gray-600">
                                <p className="text-sm text-white">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {dayjs(new Date(item.date)).format(
                                    'YYYY-MM-DD'
                                  )}
                                </p>
                              </a>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Timeline
