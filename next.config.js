const path = require('path')
const rehypePrism = require('@mapbox/rehype-prism')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    appDir: true,
    fontLoaders: [{ loader: '@next/font/google' }]
  },
  images: {
    domains: ['gyazo.com']
  },
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
            providerImportSource: '@mdx-js/react'
          }
        },
        { loader: path.join(__dirname, './lib/fm-loader') }
      ]
    })

    return config
  }
}
