import React from 'react'

import Layout from '../../components/Layout'
import { Meta } from '../../components/Meta'
import { Title } from '../../components/Title'
import path from 'path'
import fs from 'fs'
import { MetaType, Timeline } from '../../types'
import matter from 'gray-matter'
import timelineJson from '../../timeline.json'

interface Props {
  timeline: Timeline
}

const meta = { title: 'Timeline', description: 'タイムライン' }

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const root = process.cwd()
  const docs = path.join(root, 'docs')
  const entries: Timeline = fs.readdirSync(docs).map((p) => {
    const content = fs.readFileSync(path.join(docs, p), 'utf8')
    const frontMatter = matter(content).data as MetaType
    const slug = p.replace(/\.mdx/, '')
    return {
      date: frontMatter.date,
      type: 'post',
      title: frontMatter.title,
      url: `https://ellreka.net/entry/${slug}`
    }
  })

  const timeline = [...timelineJson.items, ...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { props: { timeline } }
}

const Timeline: React.FC<Props> = ({ timeline }) => {
  const years = Array.from(
    new Set(timeline.map((i) => new Date(i.date).getFullYear()))
  ).sort((a, b) => b - a)
  return (
    <Layout>
      <Meta meta={meta} />
      <div className="mx-auto h-full max-w-2xl">
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
                                className="flex w-full flex-col gap-1 rounded-md border border-gray-500 bg-gray-700 px-5 py-3 transition-colors duration-150 hover:bg-gray-600">
                                <p className="text-sm text-white">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.date}
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
    </Layout>
  )
}

export default Timeline
