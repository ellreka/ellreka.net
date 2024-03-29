const matter = require('gray-matter')
const stringifyObject = require('stringify-object')

module.exports = async function (src) {
  const callback = this.async()
  const { content, data } = matter(src)
  const headings = src.match(/^#.*./gm).map((heading) => {
    const [level, title] = heading.split(/(?<=^\S+)\s/)
    return {
      level: level.length,
      title
    }
  })

  const code = `export const headings = ${stringifyObject(
    headings
  )};\n${content}`
  return callback(null, code)
}
