import clsx from 'clsx'
import React from 'react'
import { useLocalStorage } from 'react-use'

import { Footer } from './Footer'
import { Header } from './Header'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactElement => {
  const [value, setValue] = useLocalStorage('isDark', false)
  const [isDark, setIsDark] = React.useState<boolean>(false)
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
        'mode-dark': isDark
      })}>
      <div className="px-4 bg-white dark:bg-gray-800">
        <Header isDark={isDark} toggleTheme={onChangeTheme} />
        <main className="min-h-screen mt-12">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
