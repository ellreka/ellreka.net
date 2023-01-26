import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
  activeId: string | undefined
  tabs: Array<{
    id: string
    label: string
    href: string
    icon?: string
    count: number
  }>
}

export const Tabs: FC<Props> = ({ activeId, tabs }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={clsx(
            activeId === tab.id ? 'border-2 border-slate-300' : '',
            'inline-flex items-center gap-2 rounded-md bg-gray-700 py-2 px-3 hover:bg-gray-700/80'
          )}>
          {tab?.icon && (
            <img className="h-[20px] w-[20px]" src={tab.icon} alt="" />
          )}
          <span className="text-sm text-slate-200">{tab.label}</span>
          <span className="flex items-center justify-center rounded-md bg-gray-600 px-1 text-xs text-slate-200">
            {tab.count}
          </span>
        </Link>
      ))}
    </div>
  )
}
