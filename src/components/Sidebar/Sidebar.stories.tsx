import React from 'react'

import { Sidebar } from '.'

export default { title: 'Sidebar' }

export const component = () => {
  const list = [
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

  return <Sidebar headings={list} />
}
