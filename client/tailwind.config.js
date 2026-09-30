/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#E85D26",
          dark: "#C94A18",
          light: "#FEEFEA"
        },
        tribal: {
          DEFAULT: "#1B6B3A",
          dark: "#13502A",
          light: "#E9F5EE"
        },
        accent: "#F4A261",
        surface: "#FFFFFF",
        pageBg: "#F8F9FA",
        darkText: "#1A1A2E"
      }
    }
  },
  plugins: []
};
