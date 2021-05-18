import React from 'react'

import { Sidebar } from '.'
import { Story } from '@storybook/react/types-6-0'

export default { title: 'Sidebar' }

export const sidebar: Story<React.ComponentProps<typeof Sidebar>> = (props) => {
  return <Sidebar {...props} />
}

sidebar.args = {
  headings: [
    {
      level: 2,
      title: 'Heading2'
    },
    {
      level: 3,
      title: 'Heading3'
    },
    {
      level: 2,
      title: 'Heading2'
    }
  ]
}
