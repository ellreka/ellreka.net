import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import clsx from 'clsx'

const Layout: React.FC = ({ children }) => {
  const [isDark, setIsDark] = React.useState<boolean>(true)
  return (
    <div
      className={clsx({
        'mode-dark': isDark
      })}>
      <div className="px-4 bg-white dark:bg-gray-800">
        <Header isDark={isDark} toggleTheme={(arg) => setIsDark(arg)} />
        <main className="mt-12">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
