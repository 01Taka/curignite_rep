// tailwind.config.js

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // 未使用のスタイルを削除する設定（後述の内容を追加することで最適化できます）
    darkMode: false,
    theme: {
      extend: {}, 
    },
    variants: {
      extend: {}, 
    },
    plugins: [], 
  };
  