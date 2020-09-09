import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type Props = {
  isDark: boolean
  toggleTheme: (arg: boolean) => void
}

export const Header: React.FC<Props> = ({ isDark, toggleTheme }) => {
  const handleChangeTheme = () => {
    toggleTheme(!isDark)
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
    <header className="w-full h-12 flex justify-between items-end">
      <h1 className="text-lg">
        <img src="/icon.png" alt="" className="w-6 h-6 inline-block" />
        <Link href="/">
          <a className="ml-2 text-black dark:text-white">ellreka.net</a>
        </Link>
      </h1>
      <div className="flex">
        <ul className="flex text-gray-600 italic">
          <ListItems />
        </ul>
        <label className="cursor-pointer transition duration-500 ease-in-out block w-12 h-6 bg-white dark:bg-gray-800 border-gray-800 dark:border-white relative border border-solid rounded-full">
          <span
            role="presentation"
            className={clsx(
              'block w-6 h-full rounded-full transition ease-in-out duration-300 transform',
              isDark ? 'bg-white translate-x-full' : 'bg-gray-800 translate-x-0'
            )}
          />
          <input
            type="checkbox"
            className="hidden"
            onChange={handleChangeTheme}
            checked={isDark}
          />
        </label>
      </div>
    </header>
  )
}
