import React from 'react'
import Link from 'next/link'
import '../../styles/index.css'

type Props = {
  list: Array<{
    title: string
    children: Array<{
      title: string
    }>
  }>
}

export const Sidebar: React.FC<Props> = ({ list }) => (
  <div className="bg-white">
    <ul>
      {list.map((item) => (
        <li className="text-gray-800">
          <Link href={`#${item.title}`}>
            <a className="hover:text-blue-500">{item.title}</a>
          </Link>
          {item.children && (
            <ul className="ml-6">
              {item.children.map((child) => (
                <li className="">
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
  </div>
)
