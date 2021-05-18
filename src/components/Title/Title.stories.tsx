import React from 'react'

import { Title } from '.'

import { Story } from '@storybook/react/types-6-0'

export default { title: 'Title' }

export const title: Story<React.ComponentProps<typeof Title>> = (props) => {
  return <Title {...props} />
}

title.args = {
  children: 'タイトルあああああああ'
}
