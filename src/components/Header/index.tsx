import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

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
      <li className="mr-4 hover:text-blue-500 dark:hover:text-blue-700 hidden sm:block">
        <Link href="/">
          <a>Entries</a>
        </Link>
      </li>
      <li className="mr-4 hover:text-blue-500 dark:hover:text-blue-700">
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
    </>
  )
  return (
    <header className="w-full h-12 pt-3">
      <div className="flex">
        <ul className="flex text-gray-600 dark:text-gray-400 w-1/3 justify-start">
          <ListItems />
        </ul>
        <h1 className="text-lg w-1/3 flex justify-center">
          <Link href="/">
            <a>
              <img
                src="/icon.png"
                alt=""
                className="w-6 h-6 inline-block bg-ellreka rounded-full"
              />
            </a>
          </Link>
        </h1>
        <div className="w-1/3 flex justify-end">
          <label className="cursor-pointer transition duration-500 ease-in-out block w-12 h-6 bg-white dark:bg-gray-800 border-gray-800 dark:border-white relative border border-solid rounded-full">
            <span
              role="presentation"
              className={clsx(
                'w-6 absolute top-0 left-0 ml-1 text-yellow-400',
                {
                  hidden: !isDark
                }
              )}>
              <i className="fas fa-moon" />
            </span>
            <span
              role="presentation"
              className={clsx(
                'block w-6 h-full rounded-full transition ease-in-out duration-300 transform',
                isDark
                  ? 'bg-white translate-x-full'
                  : 'bg-gray-800 translate-x-0'
              )}
            />
            <span
              role="presentation"
              className={clsx(
                'w-6 absolute top-0 right-0 -mr-1 text-orange-400',
                {
                  hidden: isDark
                }
              )}>
              <i className="fas fa-sun" />
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
