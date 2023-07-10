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
    <div className="sticky top-10 max-h-[calc(100vh-20px)] overflow-auto rounded-md bg-gray-200">
      <nav className="h-full p-3">
        <ul>
          {list.map((item, idx) => (
            <li className="mt-3 text-sm text-gray-800" key={idx}>
              <a className="hover:text-blue-500" href={`#${item.title}`}>
                {item.title}
              </a>
              {item.children !== null && (
                <ul className="ml-6">
                  {item.children.map((child, idx) => (
                    <li className="mt-3" key={idx}>
                      <a
                        className="hover:text-blue-500"
                        href={`#${child.title}`}>
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
    </div>
  )
}
