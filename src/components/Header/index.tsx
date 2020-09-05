import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

export const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const openOnClick = () => {
    setOpen(!open)
  }
  const ListItems = () => (
    <>
      <li className="mr-4 hover:text-blue-500">
        <Link href="/profile">
          <a>profile</a>
        </Link>
      </li>
      <li className="mr-4 hover:text-blue-500">
        <Link href="/tags">
          <a>tags</a>
        </Link>
      </li>
    </>
  )
  return (
    <header className="w-full h-12 bg-white flex justify-between items-end">
      <h1 className="text-lg">
        <img src="/icon.png" alt="" className="w-6 h-6 inline-block" />
        <Link href="/">
          <a className="ml-2">ellreka.net</a>
        </Link>
      </h1>
      <div className="block">
        <ul className="flex text-gray-600 italic">
          <ListItems />
        </ul>
      </div>
    </header>
  )
}
