module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: false, // または 'media' または 'class'
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: '#3B5998',
          hover: '#2d4373',
        },
        primaryBase: {
          DEFAULT: '#F0F8FF',
          hover: '#d4e1ff',
        },
        secondaryBase: {
          DEFAULT: '#D1D3E3',
          hover: '#b4b6c8',
        },
        accent: {
          DEFAULT: '#FFA500',
          hover: '#cc8400',
        },
        grayText: '#6B6B6B',
      },
      // ここにグラデーションのアニメーションを追加
      backgroundSize: {
        '200%': '200%',
        '400%': '400%',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
