module.exports = {
    content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
    darkMode: "class", // or 'media'
    theme: {
        extend: {
            colors: {
                'dark-bg': '#191716',
                'light-bg': '#ffffff',
                'dark-text': '#EE0258',
                'light-text': '#EE0258',
                pink: {
                    "light": '#F6668F',
                    DEFAULT: '#EE0258',
                    "dark": '#C40047'
                },
                gray: {
                    "background": '#191716',
                    "component": '#252525',
                    "dark": '#323232',
                    "light": '#454549',
                    "verylight": '#D9D9D9'
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};