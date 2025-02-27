'use client'

import clsx from 'clsx'
import { ReactNode, useCallback, useEffect } from 'react'
import useWebAnimations from '@wellyshen/use-web-animations'
import Link from 'next/link'

export const Card = ({
  href,
  label,
  icon,
  background,
  className,
  index
}: {
  href: string
  label: string
  icon?: ReactNode
  background?: ReactNode
  className?: string
  index?: number
}) => {
  const external = href.startsWith('http')
  const firstChar = label.charAt(0).toUpperCase()
  const restChar = label.slice(1)
  const { ref, animate } = useWebAnimations<HTMLAnchorElement>()
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const xPos = e.clientX - rect.x - rect.width / 2
      const yPos = e.clientY - rect.y - rect.height / 2
      const x = yPos / 5
      const y = -xPos / 5
      const deg = Math.abs(x) + Math.abs(y)
      // console.log({ x, y, deg })
      animate({
        keyframes: {
          transform: `scale(1.1) rotate3d(${x}, ${y}, 0, ${deg}deg)`
        },
        animationOptions: { duration: 100, fill: 'forwards' }
      })
    },
    [animate]
  )

  const handelMouseLeave = useCallback(() => {
    animate({
      keyframes: { transform: 'scale(1) rotate3d(0, 0, 0, 0deg)' },
      animationOptions: { duration: 200, fill: 'forwards' }
    })
  }, [animate])

  // 順次アニメーション機能
  useEffect(() => {
    if (typeof index === 'number') {
      const timeout = setTimeout(() => {
        // 拡大アニメーション
        animate({
          keyframes: { transform: 'scale(1.2)' },
          animationOptions: { duration: 100, fill: 'forwards' }
        })

        // 元に戻すアニメーション
        const resetTimeout = setTimeout(() => {
          animate({
            keyframes: { transform: 'scale(1)' },
            animationOptions: { duration: 100, fill: 'forwards' }
          })
        }, 200)

        return () => {
          clearTimeout(resetTimeout)
        }
      }, index * 80)

      return () => clearTimeout(timeout)
    }
  }, [index, animate])

  return (
    <Link
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handelMouseLeave}
      aria-label={label}
      href={href}
      target={external ? '_blank' : undefined}
      className={clsx(
        className,
        'group relative flex w-full items-center justify-center rounded-md bg-gradient-to-r bg-no-repeat transition-all where:aspect-square where:from-gray-700 where:to-gray-700'
      )}>
      {background != null && <>{background}</>}
      {icon == null ? (
        <span aria-hidden className="">
          <span className="inline-block -translate-x-1 text-xl font-bold text-gray-300 transition-transform">
            {firstChar}
          </span>
          <span className="text-lg text-gray-300">{restChar}</span>
        </span>
      ) : (
        <>{icon}</>
      )}
    </Link>
  )
}
