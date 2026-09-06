import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      charlie: ["Raleway", "sans-serif"],
    },
    extend: {
      colors: {
        primary: colors.rose,
        transparent: "transparent",
        background: "rgba(var(--background))",
        "copy-primary": "rgba(var(--copy-primary))",
        bgColor: "var(--bgColor)",
        textColor: "var(--textColor)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
