module.exports = {
    content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
    darkMode: "class", // or 'media'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
