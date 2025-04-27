/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#10b981', // 主要绿色
        'light-green': '#d1fae5',   // 浅绿色背景/强调
        'tech-white': '#ffffff',    // 纯白背景
        'tech-gray-50': '#f9fafb',  // 极浅灰色背景
        'tech-gray-100': '#f3f4f6', // 浅灰色背景/卡片
        'tech-gray-200': '#e5e7eb', // 边框颜色
        'tech-gray-300': '#d1d5db', // 更深的边框
        'tech-gray-600': '#4b5563', // 次要文本
        'tech-gray-700': '#374151', // 主要文本
        'tech-gray-800': '#1f2937', // 深色文本/标题
        'tech-blue-50': '#eff6ff',  // 极浅蓝色背景，用于高亮区域
        'tech-blue-500': '#3b82f6', // 蓝色强调
      }
    },
  },
  plugins: [],
}
