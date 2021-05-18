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
      <li className="dark:hover:text-blue-700 hidden mr-4 hover:text-blue-500 sm:block">
        <Link href="/">
          <a>Entries</a>
        </Link>
      </li>
      <li className="dark:hover:text-blue-700 mr-4 hover:text-blue-500">
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
    </>
  )
  return (
    <header className="pt-3 w-full h-12">
      <div className="flex">
        <ul className="flex justify-start w-1/3 dark:text-gray-400 text-gray-600">
          <ListItems />
        </ul>
        <h1 className="flex justify-center w-1/3 text-lg">
          <Link href="/">
            <a>
              <img
                src="/icon.png"
                alt=""
                className="inline-block w-6 h-6 bg-ellreka rounded-full"
              />
            </a>
          </Link>
        </h1>
        <div className="flex justify-end w-1/3">
          <label className="relative block w-12 h-6 dark:bg-gray-800 bg-white border border-solid border-gray-800 dark:border-white rounded-full cursor-pointer transition duration-500 ease-in-out">
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
                'block w-6 h-full rounded-full transform transition duration-300 ease-in-out',
                isDark
                  ? 'bg-white translate-x-full'
                  : 'bg-gray-800 translate-x-0'
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
        </div>
      </div>
    </header>
  )
}
