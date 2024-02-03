import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props {
  isDark: boolean
  toggleTheme: (arg: boolean) => void
}

const links = [
  {
    href: '/entries',
    label: 'Entries'
  },
  {
    href: '/releases',
    label: 'Releases'
  },
  {
    href: '/timeline',
    label: 'Timeline'
  },
  // {
  //   href: '/about',
  //   label: 'About'
  // }
]

export function Header({ isDark, toggleTheme }: Props): React.ReactElement {
  const handleChangeTheme = (): void => {
    toggleTheme(!isDark)
  }
  return (
    <header className="relative h-12 w-full pt-3">
      <div className="flex items-center">
        <ul className="order-2 flex justify-start gap-3 text-gray-600 dark:text-gray-400 sm:order-1 sm:w-1/3">
          {links.map((link) => (
            <li
              key={link.label}
              className="sm:text-base text-sm hover:text-blue-700">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <h1 className="order-1 mr-5 flex justify-center self-center text-lg sm:order-2 sm:mr-0 sm:w-1/3">
          <Link href="/">
            <img
              src="/icon.png"
              alt=""
              className="inline-block h-6 w-6 rounded-full bg-ellreka"
            />
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
