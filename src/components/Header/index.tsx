import React from 'react'
import Link from 'next/link'

export const Header = (): React.ReactElement => (
  <header className="w-full h-12 bg-white flex justify-between items-end max-w-6xl mx-auto">
    <h1 className="text-lg">
      <img src="/icon.png" alt="" className="w-6 h-6 inline-block" />
      <Link href="/">
        <a className="ml-2">ellreka.net</a>
      </Link>
    </h1>
    <ul className="flex text-gray-600 italic">
      <li className="mr-4 hover:text-blue-500">
        <Link href="/about">
          <a>about</a>
        </Link>
      </li>
      <li className="mr-4 hover:text-blue-500">
        <Link href="/list">
          <a>list</a>
        </Link>
      </li>
      <li className="mr-4 hover:text-blue-500">
        <Link href="/tags">
          <a>tags</a>
        </Link>
      </li>
    </ul>
  </header>
)
