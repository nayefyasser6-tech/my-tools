import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#151515", // خلفية الموقع
        ember: "#242424",    // خلفية الكروت
        parchment: "#e9ebdf", // لون النصوص
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      boxShadow: {
        // تأثير الظل عند المرور (ألوان مرادفة للصورة الثالثة - برتقالي/بنفسجي)
        'glow': '0 0 25px rgba(255, 92, 0, 0.3)',
        'glow-purple': '0 0 25px rgba(138, 43, 226, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;