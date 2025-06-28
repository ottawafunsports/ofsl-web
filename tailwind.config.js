module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "m3-body-large": "var(--m3-body-large-font-family)",
        "m3-title-large": "var(--m3-title-large-font-family)",
        "m3-title-medium": "var(--m3-title-medium-font-family)",
        "heading": "var(--heading-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#B20000",
          hover: "#8A0000",
          light: "#FF1A1A",
        },
        secondary: {
          DEFAULT: "#6F6F6F",
          hover: "#575757",
          light: "#D4D4D4",
        },
        accent: {
          DEFAULT: "#000000",
          hover: "#1A1A1A",
          transparent: "rgba(0, 0, 0, 0.18)",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F9FAFB",
        },
      },
      borderRadius: {
        lg: "20px",
        md: "16px",
        sm: "12px",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1280px" } },
  },
  plugins: [require('@tailwindcss/typography')],
};