import { ReactElement, CSSProperties } from 'react'
import clsx from 'clsx'
import NextImage from 'next/image'

interface ImageProps {
  width?: string | number
  height?: string | number
  alt?: string
  src: string
  className?: string
  style?: CSSProperties
}
export function Image({
  width,
  height,
  alt,
  src,
  className,
  style
}: ImageProps): ReactElement {
  return (
    <a href={src} target="_blank" rel="noreferrer" className="block">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={clsx('h-auto w-full cursor-pointer md:w-1/2', className)}
        style={style}
      />
    </a>
  )
}
