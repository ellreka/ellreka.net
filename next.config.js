const path = require('path')
const rehypePrism = require('@mapbox/rehype-prism')
// const withMDX = require('@next/mdx')({
//   extension: /\.mdx?$/,
//   options: {
//     providerImportSource: '@mdx-js/react',
//     rehypePlugins: [rehypePrism]
//   }
// })

// module.exports = withMDX({
//   pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
//   webpack(config, _) {
//     config.module.rules.push({
//       test: /\.mdx/,
//       use: [path.join(__dirname, './lib/fm-loader')]
//     })
//     return config
//   }
// })

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  // Support MDX files as pages:
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  // Support loading `.md`, `.mdx`:
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        // The default `babel-loader` used by Next:
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          /** @type {import('@mdx-js/loader').Options} */
          options: {
            providerImportSource: '@mdx-js/react',
            rehypePlugins: [rehypePrism]
          }
        },
        { loader: path.join(__dirname, './lib/fm-loader') }
      ]
    })

    return config
  }
}
