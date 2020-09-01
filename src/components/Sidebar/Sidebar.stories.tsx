import React from 'react'
import { Sidebar } from './Sidebar'

export default { title: 'Sidebar' }

export const component = () => {
  const list = [
    {
      title: 'Heading2',
      children: [
        {
          title: 'Heading3'
        },
        {
          title: 'Heading3'
        },
        {
          title: 'Heading3'
        }
      ]
    },
    {
      title: 'Heading2',
      children: []
    }
  ]

  return <Sidebar list={list} />
}
