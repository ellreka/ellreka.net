import React from 'react'

interface Props {
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

export function Sidebar({ headings }: Props): React.ReactElement {
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
    <nav className="sticky top-10 p-3 bg-gray-200">
      <ul>
        {list.map((item, idx) => (
          <li className="mt-3 text-gray-800 text-sm" key={idx}>
            <a className="hover:text-blue-500" href={`#${item.title}`}>
              {item.title}
            </a>
            {item.children !== null && (
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
