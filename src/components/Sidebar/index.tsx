import React from 'react'
import Link from 'next/link'

type Props = {
  list: Array<{
    title: string
    children: Array<{
      title: string
    }>
  }>
}

export const Sidebar: React.FC<Props> = ({ list }) => (
  <nav className="sticky top-10 bg-gray-200">
    <ul>
      {list.map((item, idx) => (
        <li className="text-gray-800" key={idx}>
          <Link href={`#${item.title}`}>
            <a className="hover:text-blue-500">{item.title}</a>
          </Link>
          {item.children && (
            <ul className="ml-6">
              {item.children.map((child, idx) => (
                <li className="" key={idx}>
                  <Link href={`#${child.title}`}>
                    <a className="hover:text-blue-500">- {child.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </nav>
)
