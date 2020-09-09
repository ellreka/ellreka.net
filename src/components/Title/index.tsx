import React from 'react'

type Props = {
  children: string
}

export const Title: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="text-gray-700 dark:text-gray-300 text-xl text-center">
      <span className="mr-1">-</span>
      {children}
      <span className="ml-1">-</span>
    </h1>
  )
}
