module.exports = {
  ...require('@ellreka/configs/tailwind.config'),
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('tailwindcss-dark-mode')()],
  theme: {
    extend: {
      inset: {
        10: '10px'
      },
      minWidth: {
        56: '14rem'
      }
    }
  },
  variants: {
    backgroundColor: [
      'hover',
      'dark',
      'dark-hover',
      'dark-group-hover',
      'dark-even',
      'dark-odd'
    ],
    borderColor: [
      'hover',
      'dark',
      'dark-disabled',
      'dark-focus',
      'dark-focus-within'
    ],
    textColor: [
      'hover',
      'dark',
      'dark-hover',
      'dark-active',
      'dark-placeholder'
    ]
  }
}
