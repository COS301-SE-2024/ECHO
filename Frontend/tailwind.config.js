module.exports = {
    content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
    darkMode: "class", // or 'media'
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Noto Sans', 'sans-serif'] 
             },
            colors: {
                'dark-bg': '#191716',
                'light-bg': '#ffffff',
                'dark-text': '#EE0258',
                'light-text': '#EE0258',
                'desktop-bg': '#323232',
                pink: {
                    "white": '#E8D5DA',
                    "verylight": '#FFABC2',
                    "light": '#F6668F',
                    DEFAULT: '#EE0258',
                    "dark": '#C40047'
                },
                gray: {
                    "background": '#191716',
                    "component": '#252525',
                    "dark": '#323232',
                    "light": '#454549',
                    "verylight": '#D9D9D9',
                    "lightcomponent": '#9A9A9E',
                },
                default: {
                    DEFAULT: '#EE0258',
                    "text": '#ffffff',
                    "component": '#252525',
                    "dark": '#C40047',
                    "background": '#323232',
                },
                admiration: {
                    DEFAULT: '#D44000',
                    "text": '#FFD700',
                    "component": '#252525',
                    "dark": '#890817',
                },
                anger:{
                    DEFAULT: '#A40014',
                    "text": '#FFB9B9',
                    "component": '#221113',
                    "dark": '#890817',
                },
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};