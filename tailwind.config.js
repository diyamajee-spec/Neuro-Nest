/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#00f3ff",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f43f5e",
          foreground: "#ffffff",
        },
        "cyber-dark": {
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
