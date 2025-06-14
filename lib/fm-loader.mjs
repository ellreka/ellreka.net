import matter from 'gray-matter'
import stringifyObject from 'stringify-object'

export default async function fmLoader(src) {
  const callback = this.async()
  const { content, data } = matter(src)
  
  // Extract headings from markdown
  const headingMatches = src.match(/^#{1,6}\s+.+$/gm) || []
  const headings = headingMatches.map((heading) => {
    const match = heading.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      return {
        level: match[1].length,
        title: match[2].trim()
      }
    }
    return null
  }).filter(Boolean)

  const code = `export const headings = ${stringifyObject(headings)};\n${content}`
  return callback(null, code)
}