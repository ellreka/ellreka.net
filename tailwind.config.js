module.exports = {
  ...require('@ellreka/configs/tailwind.config'),
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      inset: {
        10: '10px'
      }
    }
  }
}
