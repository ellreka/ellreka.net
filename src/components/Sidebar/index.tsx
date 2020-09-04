import React from 'react'
import Link from 'next/link'

type Props = {
  headings: Array<{
    level: number
    title: string
  }>
}

type List = Array<{
  title: string
  children: Array<{
    title: string
  }>
}>

export const Sidebar: React.FC<Props> = ({ headings }) => {
  const list: List = []
  let cnt = 0
  headings.forEach((heading) => {
    if (heading.level === 2) {
      list.push({
        title: heading.title,
        children: []
      })
      cnt++
    }
    if (heading.level === 3) {
      list[cnt - 1].children.push({
        title: heading.title
      })
    }
  })
  return (
    <nav className="sticky top-10 bg-gray-200 p-3">
      <ul>
        {list.map((item, idx) => (
          <li className="text-gray-800 text-sm mt-3" key={idx}>
            <a className="hover:text-blue-500" href={`#${item.title}`}>
              {item.title}
            </a>
            {item.children && (
              <ul className="ml-6">
                {item.children.map((child, idx) => (
                  <li className="mt-3" key={idx}>
                    <a className="hover:text-blue-500" href={`#${child.title}`}>
                      - {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
