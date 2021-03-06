module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        'p-purple': 'rgb(119,84,248)',
        'p-light-purple': '#F0EDFE',
        'p-orange': 'rgb(223, 80, 110)',
        'p-medium-gray': '#878787',
        'p-dark-blue': '#0a1032',
        'p-light-blue': '#e3eaf2',
        'black-t-50': 'rgba(0, 0, 0, 0.5)'
      }
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [],
}
