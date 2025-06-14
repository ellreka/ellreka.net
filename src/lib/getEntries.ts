import path from 'path'
import fs from 'fs'
import { evaluateSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MetaType } from '../types'

const root = process.cwd()
const docs = path.join(root, 'docs')

export const getEntries = async () => {
  const filepaths = fs.readdirSync(docs)
  const tmpEntries = []

  for (const filepath of filepaths) {
    if (!filepath.endsWith('.mdx')) continue
    
    const fullPath = path.join(docs, filepath)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    
    try {
      // Properly evaluate the MDX content to extract exports
      const { meta } = evaluateSync(fileContent, {
        ...runtime,
        development: false,
        baseUrl: import.meta.url
      })
      
      if (meta) {
        tmpEntries.push({
          slug: filepath.replace(/\.mdx/, ''),
          meta: meta as MetaType
        })
      }
    } catch (error) {
      console.error(`Error parsing MDX from ${filepath}:`, error)
    }
  }

  const entries = tmpEntries.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  )

  return entries
}