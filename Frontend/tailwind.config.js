const plugin = require('tailwindcss/plugin')
module.exports = {
    content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
    darkMode: "class", // or 'media'
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Noto Sans', 'sans-serif'],
                'app': ['Montserrat', 'sans-serif'], 
            },
            margin: {
                '100': '400px', 
                '104': '416px', 
                '108': '432px', 
                '112': '448px', 
                '120': '480px', 
                '128': '512px', 
              },
            transitionProperty: {
                'mood': 'background-color, color', // Specify which properties to transition
              },
              transitionTimingFunction: {
                'mood': 'ease-in-out',
              },
              transitionDuration: {
                'mood': '1000ms', // Adjust the duration as needed
              },
            colors: {
                gray: {
                    "background": '#191716',
                    "component": '#252525',
                    "dark": '#323232',
                    "light": '#454549',
                    "verylight": '#D9D9D9',
                    "lightcomponent": '#9A9A9E',
                    "newDark": '#0F0F0F'
                },
                default: {
                    DEFAULT: '#EE0258',
                    "text": '#ffffff',
                    "component": '#252525',
                    "dark": '#C40047',
                    "backgrounddark": '#323232',
                    "background": 'black',
                },
                joy: {
                        "DEFAULT": "#F4BD01",
                        "text": "#FFFFFF",
                        "component": "#F4BD01",
                        "dark": "#DA9808",
                        "backgrounddark": "#FFFFE0",
                        "background": "#FFFACD"
                    },
                surprise: {
                        "DEFAULT": "#1AADB8",
                        "text": "#FFFFFF",
                        "component": "#1AADB8",
                        "dark": "#05959F",
                        "backgrounddark": "#323232",
                        "background": "#05959F"
                    },
                    sadness: {
                        "DEFAULT": "#4C8EC5",
                        "text": "#FFFFFF",
                        "component": "#4C8EC5",
                        "dark": "#2170B2",
                        "backgrounddark": "#2170B2",
                        "background": "#2170B2"
                    },
                    anger: {
                        "DEFAULT": "#A40014",
                        "text": "#FFFFFF",
                        "component": "#221113",
                        "dark": "#890817",
                        "backgrounddark": "#471C21",
                        "background": "#FFCCCC"
                    },
                    disgust: {
                        "DEFAULT": "#556B2F",
                        "text": "#FFFFFF",
                        "component": "#6B8E23",
                        "dark": "#4B5320",
                        "backgrounddark": "#8FBC8F",
                        "background": "#98FB98"
                    },
                    contempt: {
                        "DEFAULT": "#708090",
                        "text": "#FFFFFF",
                        "component": "#778899",
                        "dark": "#56697B",
                        "backgrounddark": "#DCDCDC",
                        "background": "#D3D3D3"
                    },
                    shame: {
                        "DEFAULT": "#FFA0AE",
                        "text": "#FFFFFF",
                        "component": "#FFA0AE",
                        "dark": "#FF788C",
                        "backgrounddark": "#FFDAB9",
                        "background": "#FFC0CB"
                    },
                    fear: {
                        "DEFAULT": "#8E71C3",
                        "text": "#FFFFFF",
                        "component": "#8E71C3",
                        "dark": "#7456AD",
                        "backgrounddark": "#462E5E",
                        "background": "#E6E6FA"
                    },
                    guilt: {
                        "DEFAULT": "#703F9E",
                        "text": "#FFFFFF",
                        "component": "#703F9E",
                        "dark": "#53277D",
                        "backgrounddark": "#FA8072",
                        "background": "#FF6347"
                    },
                    excitement: {
                        DEFAULT: '#FF5308',
                        "text": '#FFFFFF',
                        "component": '#252525',
                        "dark": '#D44000',
                        "backgrounddark": '#5F3625',
                        "background": '#FFEBCC',
                    },
                    love: {
                        "DEFAULT": "#EE3B85",
                        "text": "#FFE4E1",
                        "component": "#EE3B85",
                        "dark": "#DB3077",
                        "backgrounddark": "#FFD1DC",
                        "background": "#FFB6C1"
                    },
                },                                
            }
        },
    variants: {
        extend: {
            backgroundColor: ['dark', 'hover', 'focus', 'transition'],
            textColor: ['dark', 'hover', 'focus', 'transition'],
        },
    },
    plugins: [require("@tailwindcss/forms"), require("flowbite/plugin"),
        plugin(function({ addVariant }) {
            addVariant('slider-thumb', ['&::-webkit-slider-thumb', '&::slider-thumb']);
          }),
    ],
};