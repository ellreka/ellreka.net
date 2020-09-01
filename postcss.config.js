module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env'),
    process.env.NODE_ENV === 'production'
      ? require('@fullhuman/postcss-purgecss')({
          content: ['./src/**/*.{js,jsx,ts,tsx}'],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
        })
      : undefined
  ]
}
