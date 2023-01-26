import { EntriesType } from '@/types'

export const getTabs = ({
  entries,
  tags
}: {
  entries: EntriesType
  tags: {
    name: string
    count: number
  }[]
}) => {
  const tabs = [
    {
      id: 'all',
      label: 'All',
      href: '/entries',
      count: entries.length
    },
    {
      id: 'ellreka',
      label: 'ellreka.net',
      href: '/entries/ellreka',
      icon: '/favicon.ico',
      count: entries.filter((entry) => entry.site === 'ellreka').length
    },
    {
      id: 'zenn',
      label: 'zenn.dev',
      href: '/entries/zenn',
      icon: '/assets/logo/zenn.svg',
      count: entries.filter((entry) => entry.site === 'zenn').length
    },
    {
      id: 'Tips',
      label: 'Tips',
      href: '/entries/Tips',
      icon: '/assets/logo/tips.png',
      count: tags.find((tag) => tag.name === 'Tips')?.count ?? 0
    },
    {
      id: 'TypeScript',
      label: 'TypeScript',
      href: '/entries/TypeScript',
      icon: '/assets/logo/typescript.svg',
      count: tags.find((tag) => tag.name === 'TypeScript')?.count ?? 0
    }
  ]
  return tabs
}
