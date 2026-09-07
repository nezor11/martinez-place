// Tailwind's rose palette, inlined so the config has no runtime import.
const rose = {
  50: "#fff1f2",
  100: "#ffe4e6",
  200: "#fecdd3",
  300: "#fda4af",
  400: "#fb7185",
  500: "#f43f5e",
  600: "#e11d48",
  700: "#be123c",
  800: "#9f1239",
  900: "#881337",
  950: "#4c0519",
};

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
        primary: rose,
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
