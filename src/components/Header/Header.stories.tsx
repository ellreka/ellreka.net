import React from 'react'

import { Header } from '.'
import { Story } from '@storybook/react/types-6-0'

export default { title: 'Header' }

export const header: Story<React.ComponentProps<typeof Header>> = (props) => {
  return <Header {...props} />
}

header.args = {
  isDark: true,
  toggleTheme: () => {}
}
