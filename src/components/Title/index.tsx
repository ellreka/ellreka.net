import React from 'react'

interface Props {
  children: string
}

export function Title({ children }: Props): React.ReactElement {
  return (
    <h1 className="text-center dark:text-gray-300 text-gray-700 text-xl">
      <span className="mr-1">-</span>
      {children}
      <span className="ml-1">-</span>
    </h1>
  )
}
