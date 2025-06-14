'use client'

import clsx from 'clsx'
import React from 'react'
import { useLocalStorage } from 'react-use'

import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

interface Props {
  children: React.ReactNode
}

function Layout({ children }: Props): React.ReactElement {
  const [value, setValue] = useLocalStorage('isDark', true)
  const [isDark, setIsDark] = React.useState<boolean>(true)
  const onChangeTheme = (arg: boolean): void => {
    setIsDark(arg)
    setValue(arg)
  }
  React.useEffect(() => {
    if (value !== undefined) {
      setIsDark(value)
    }
  }, [value])
  return (
    <div
      className={clsx({
        dark: isDark
      })}>
      <div
        className="flex flex-col bg-white px-4 dark:bg-slate-900"
        style={{
          minHeight: '100svh'
        }}>
        <Header isDark={true} toggleTheme={onChangeTheme} />
        <main className="mt-12 h-full grow">{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  )
}

export default Layout
