const matter = require('gray-matter')
const stringifyObject = require('stringify-object')
const Mercury = require('@postlight/mercury-parser')

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
  const regex =
    /^https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/gm

  const urls = content.match(regex) || []
  const ogpObj = {}
  for (const url of urls) {
    const ogps = await Mercury.parse(url).then((result) => result)
    ogpObj[url] = {
      title: ogps.title,
      description: ogps.excerpt,
      url: ogps.url,
      domain: ogps.domain,
      image: ogps['lead_image_url']
    }
  }
  const c = content.replaceAll(regex, (text) => {
    const title = ogpObj[text]?.title
    return `<a
    href="${text}" 
${
  title != null &&
  `data-title="${title}"
  data-description="${ogpObj[text]?.description}"
  data-url="${ogpObj[text]?.url}"
  data-domain="${ogpObj[text]?.domain}"
  data-image="${ogpObj[text]?.image}"`
}>${text}</a>`
  })

  const code = `export const frontMatter = {meta: ${stringifyObject(
    data
  )}, headings: ${stringifyObject(headings)}}\n${c}`
  return callback(null, code)
}
