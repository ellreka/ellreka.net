'use client'

import clsx from 'clsx'
import { ReactNode, useState, useEffect, useCallback } from 'react'
import useWebAnimations from '@wellyshen/use-web-animations'
import Link from 'next/link'

export const Card = ({
  href,
  label,
  icon,
  background,
  className
}: {
  href: string
  label: string
  icon?: ReactNode
  background?: ReactNode
  className?: string
}) => {
  const firstChar = label.charAt(0).toUpperCase()
  const restChar = label.slice(1)
  const { ref, animate, getAnimation } = useWebAnimations<HTMLAnchorElement>()
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientY - rect.y - rect.height / 2) / 3
      const y = (e.clientX - rect.x - rect.width / 2) / 3
      console.log(x, y)
      animate({
        // keyframes: { transform: `rotateX(${x}deg) rotateY(${y}deg)` },
        keyframes: { transform: `rotate3d(${x}, ${y}, 0, ${x}deg)` },
        animationOptions: { duration: 500, fill: 'forwards' }
      })
    },
    [animate]
  )

  return (
    <Link
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => getAnimation()?.finish()}
      aria-label={label}
      href={href}
      className={clsx(
        className,
        'group relative flex w-full items-center justify-center rounded-md border border-white/60 bg-gradient-to-r from-slate-900 to-slate-600 bg-no-repeat where:aspect-square'
      )}>
      {background != null && <>{background}</>}
      {icon == null ? (
        <span aria-hidden className="">
          <span className="inline-block text-xl font-bold text-gray-300 transition-transform -translate-x-1 -rotate-12">
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
