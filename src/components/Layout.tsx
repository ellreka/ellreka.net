import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

const Layout: React.FC = ({ children }) => {
  return (
    <div className="px-4">
      <Header />
      <main className="mt-12">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
