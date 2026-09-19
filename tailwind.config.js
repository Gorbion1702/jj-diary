/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        diary: {
          50: '#ffffff',
          100: '#feecf5',
          200: '#fcd7eb',
          300: '#fcb9dc',
          400: '#fc90cb',
        }
      },
    },
  },
  plugins: [],
};
export default config;