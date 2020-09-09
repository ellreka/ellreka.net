import React from 'react'
import { Header } from '.'
import '../../styles/index.css'

export default { title: 'Header' }

const [isDark, setIsDark] = React.useState<boolean>(true)

export const component = () => (
  <Header isDark={isDark} toggleTheme={(arg) => setIsDark(arg)} />
)
