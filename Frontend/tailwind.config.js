module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // or 'media'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};