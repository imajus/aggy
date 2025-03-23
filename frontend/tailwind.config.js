// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // etc.
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#2B6CB0",
          light: "#4299E1",
          dark: "#2C5282",
        },
        secondary: {
          main: "#38A169",
          light: "#48BB78",
          dark: "#2F855A",
        },
        background: {
          main: "#F7FAFC", 
          paper: "#FFFFFF",
          sidebar: "#EDF2F7",
        },
        text: {
          primary: "3173E2",
          secondary: "#4A5568",
          light: "#676FFF",
        },
        border: "#E2E8F0",
      },
      // spacing, borderRadius, etc. if you wish
    },
  },
  plugins: [],
};
