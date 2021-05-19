import React from 'react'

import { Footer } from '.'

import { Story } from '@storybook/react/types-6-0'

export default { title: 'Footer' }

export const footer: Story<React.ComponentProps<typeof Footer>> = (props) => {
  return (
    <div className="mb-60">
      <Footer />
    </div>
  )
}

footer.args = {}
