import clsx from 'clsx'
import React from 'react'
import { useLocalStorage } from 'react-use'

import { Footer } from './Footer'
import { Header } from './Header'

interface Props {
  children: React.ReactNode
}

function Layout({ children }: Props): React.ReactElement {
  const [isDark, setIsDark] = useLocalStorage('isDark', true)
  const onChangeTheme = (arg: boolean): void => {
    setIsDark(arg)
  }
  return (
    <div
      className={clsx({
        dark: isDark
      })}>
      <div className="px-4 bg-white dark:bg-gray-800">
        <Header isDark={isDark ?? true} toggleTheme={onChangeTheme} />
        <main className="min-h-screen mt-12">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
