import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1f77b4",
          50: "#f0f7fc",
          100: "#e0eff9",
          200: "#b3dff2",
          300: "#85ceeb",
          400: "#58bee4",
          500: "#1f77b4",
          600: "#1a6399",
          700: "#154f7d",
          800: "#103b62",
          900: "#0b2747",
        },
      },
    },
  },
  plugins: [],
};

export default config;
