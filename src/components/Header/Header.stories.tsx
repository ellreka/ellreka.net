import '../../styles/index.css'

import React from 'react'

import { Header } from '.'

export default { title: 'Header' }

const [isDark, setIsDark] = React.useState<boolean>(true)

export const component = () => (
  <Header isDark={isDark} toggleTheme={(arg) => setIsDark(arg)} />
)
