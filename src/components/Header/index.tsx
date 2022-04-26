import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  isDark: boolean
  toggleTheme: (arg: boolean) => void
}

export function Header({ isDark, toggleTheme }: Props): React.ReactElement {
  const handleChangeTheme = (): void => {
    toggleTheme(!isDark)
  }

  const ListItems = (): JSX.Element => (
    <>
      <li className="sm:text-md mr-4 hidden text-sm hover:text-blue-500 dark:hover:text-blue-700 sm:block">
        <Link href="/">
          <a>Entries</a>
        </Link>
      </li>
      <li className="sm:text-md mr-4 text-sm hover:text-blue-500 dark:hover:text-blue-700">
        <Link href="/timeline">
          <a>Timeline</a>
        </Link>
      </li>
      <li className="sm:text-md mr-4 text-sm hover:text-blue-500 dark:hover:text-blue-700">
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
    </>
  )
  return (
    <header className="h-12 w-full pt-3">
      <div className="flex">
        <ul className="flex w-1/3 justify-start text-gray-600 dark:text-gray-400">
          <ListItems />
        </ul>
        <h1 className="flex w-1/3 justify-center text-lg">
          <Link href="/">
            <a>
              <img
                src="/icon.png"
                alt=""
                className="inline-block h-6 w-6 rounded-full bg-ellreka"
              />
            </a>
          </Link>
        </h1>
        {/* <div className="flex w-1/3 justify-end">
          <label className="relative block h-6 w-12 cursor-pointer rounded-full border border-solid border-gray-800 bg-white transition duration-500 ease-in-out dark:border-white dark:bg-gray-800">
            <span
              role="presentation"
              className={clsx(
                'absolute left-0 top-0 ml-1 w-6 text-yellow-400',
                {
                  hidden: !isDark
                }
              )}>
              <FontAwesomeIcon icon={faMoon} />
            </span>
            <span
              role="presentation"
              className={clsx(
                'block h-full w-6 transform rounded-full transition duration-300 ease-in-out',
                isDark
                  ? 'translate-x-full bg-white'
                  : 'translate-x-0 bg-gray-800'
              )}
            />
            <span
              role="presentation"
              className={clsx(
                'absolute right-0 top-0 -mr-1 w-6 text-orange-400',
                {
                  hidden: isDark
                }
              )}>
              <FontAwesomeIcon className="" icon={faSun} />
            </span>
            <input
              type="checkbox"
              className="hidden"
              onChange={handleChangeTheme}
              checked={isDark}
            />
          </label>
        </div> */}
      </div>
    </header>
  )
}
