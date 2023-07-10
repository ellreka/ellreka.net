import NextLink from 'next/link'
import { FC } from 'react'

type Props = {
  href: string
  target?: string
  children: React.ReactNode
}

export const Link: FC<Props> = ({ href, target = '_blank', children }) => {
  return (
    <NextLink href={href} className="break-all text-blue-500 text-sm sm:text-base" target={target}>
      {children != null ? children : href}
    </NextLink>
  )
}
