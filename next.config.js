const path = require('path')
const rehypePrism = require('@mapbox/rehype-prism')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism]
  }
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack(config, _) {
    config.module.rules.push({
      test: /\.mdx/,
      use: [path.join(__dirname, './lib/fm-loader')]
    })
    return config
  }
})
