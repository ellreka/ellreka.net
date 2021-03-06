const colors = require('tailwindcss/colors')

module.exports = {
  ...require('@ellreka/configs/tailwind.config'),
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@ellreka/tailwindcss-table')],
  darkMode: 'class',
  mode: process.env.NODE_ENV ? 'jit' : undefined,
  theme: {
    extend: {
      colors: {
        orange: colors.orange
      },
      backgroundColor: {
        ellreka: '#EEDE9D'
      },
      inset: {
        10: '10px'
      },
      minWidth: {
        56: '14rem'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      borderColor: ['dark'],
      textColor: ['dark', 'th', 'td']
    }
  }
}
