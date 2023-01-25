const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

const addVariant = plugin(({ addVariant, e }) => {
  addVariant('where', ':where(&)')
})

module.exports = {
  ...require('@ellreka/configs/tailwind.config'),
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@ellreka/tailwindcss-table'), addVariant],
  darkMode: 'class',
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
