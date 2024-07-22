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
                    "background": '#5F3625',
                },
                anger:{
                    DEFAULT: '#A40014',
                    "text": '#FFB9B9',
                    "component": '#221113',
                    "dark": '#890817',
                    "background": '#471C21',
                },
                fear:{
                    DEFAULT: '#9A44CE',
                    "text": '#1dff3c',
                    "component": '#C639A2',
                    "dark": '#ff00d8',
                    "background": '#462E5E',
                },
                joy:{
                    DEFAULT: '#FFD700',
                    "text": 'black',
                    "component": '#FFD700',
                    "dark": '#0027f9',
                    "background": '#b18a01',
                },
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};