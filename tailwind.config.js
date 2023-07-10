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
      },
      listStyleType: {
        circle: 'circle'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out'
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
