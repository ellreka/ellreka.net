import React from 'react'

interface Props {
  children: string
}

export function Title({ children }: Props): React.ReactElement {
  return (
    <h1 className="text-gray-700 dark:text-gray-300 text-xl text-center">
      <span className="mr-1">-</span>
      {children}
      <span className="ml-1">-</span>
    </h1>
  )
}
