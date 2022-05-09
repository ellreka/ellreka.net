import path from 'path'
import fs from 'fs'
import { MetaType } from '../types'

const root = process.cwd()
const docs = path.join(root, 'docs')

export const getEntries = async () => {
  const filepaths = fs.readdirSync(docs)
  const tmpEntries = []

  for (const filepath of filepaths) {
    const { meta } = await import(`../../docs/${filepath}`)
    tmpEntries.push({
      slug: filepath.replace(/\.mdx/, ''),
      meta: meta as MetaType
    })
  }

  const entries = tmpEntries.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  )

  return entries
}
