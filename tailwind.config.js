/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        primary: { DEFAULT: "#FF6B35", light: "#FF8C5A", dark: "#E55A2B", 50: "#FFF5F0", 100: "#FFE6D9", 200: "#FFCBB3" },
        secondary: { DEFAULT: "#1A365D", light: "#2A4A7F", dark: "#0F2340", 50: "#EBF0F7", 100: "#D1DCF0" },
        gold: { DEFAULT: "#F6AD55", light: "#F9C27D", dark: "#E09530" },
        emerald: { DEFAULT: "#48BB78", light: "#68D391", dark: "#38A169" },
        coral: { DEFAULT: "#FC8181", light: "#FEB2B2", dark: "#F56565" },
        surface: "#FFFFFF", bg: "#F7F8FC",
      },
      fontFamily: { sans: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"] },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { card: "0 2px 12px rgba(0, 0, 0, 0.06)", "card-hover": "0 8px 25px rgba(0, 0, 0, 0.1)", sidebar: "2px 0 8px rgba(0, 0, 0, 0.04)" },
      animation: { "fade-in": "fadeIn 0.4s ease-out forwards", "slide-in": "slideInLeft 0.3s ease-out forwards", "badge-glow": "badgeGlow 2s ease-in-out infinite", shimmer: "shimmer 2s infinite", float: "float 3s ease-in-out infinite" },
    },
  },
  plugins: [],
};
