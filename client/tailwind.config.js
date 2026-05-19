/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiftIndigo: "#6366F1",
        swiftPink: "#E92A9F",
      },
    },
  },
  plugins: [],
}