module.exports = {
  theme: {
    extend: {
      keyframes: {
        spin: {
          '0%': { right: '-100%' },
          '100%': { right: '0' }
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear'
      }
    }
  }
}


