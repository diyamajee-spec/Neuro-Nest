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
        background: "#0A0A0B",
        surface: "#161618",
        foreground: "#E2E2E2",
        primary: {
          DEFAULT: "#00F5FF",
          glow: "rgba(0, 245, 255, 0.5)",
        },
        secondary: "#7000FF",
        accent: "#FF00E5",
        gray: {
          900: "#0A0A0B",
          800: "#161618",
          700: "#232326",
          600: "#2D2D31",
          400: "#A1A1AA",
          200: "#E2E2E2",
        },
        fontFamily: {
          sans: ["var(--font-inter)", "sans-serif"],
          display: ["var(--font-display)", "sans-serif"],
          mono: ["var(--font-mono)", "monospace"],
        },
      },
      backgroundImage: {
        'neural-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
