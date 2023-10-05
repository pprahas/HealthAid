import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", '--font-sans']
      }
    }
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      "healthaid": {
        colors: {
          background: "#A1E5AB",
          foreground: "#000000",
          primary: {
            100: "#D6EDFF",
            200: "#ADD7FF",
            300: "#83BFFF",
            400: "#65A9FF",
            500: "#3284FF",
            600: "#2466DB",
            700: "#194BB7",
            800: "#0F3493",
            900: "#09247A",
          },
          secondary: {
            100: "#F2FDEE",
            200: "#E2FCDE",
            300: "#CCF7CB",
            400: "#BAEFBC",
            500: "#A1E5AB",
            600: "#75C488",
            700: "#51A46D",
            800: "#338456",
            900: "#1E6D47",
            DEFAULT: "#A1E5AB",
            foreground: "#000000",
          },

          warning: {
            100: "#FFFBD8",
            200: "#FFF7B1",
            300: "#FFF28A",
            400: "#FFED6D",
            500: "#FFE53D",
            600: "#DBC12C",
            700: "#B79E1E",
            800: "#937D13",
            900: "#7A650B",
          }
        }
      }
    }
  })
  ],
}
