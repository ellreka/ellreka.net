import clsx from 'clsx'
import React from 'react'
import { useLocalStorage } from 'react-use'

import { Footer } from './Footer'
import { Header } from './Header'

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
      <div className="px-4 dark:bg-gray-800 bg-white">
        <Header isDark={isDark} toggleTheme={onChangeTheme} />
        <main className="mt-12 min-h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
