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
                        "DEFAULT": "#FFD700",
                        "text": "#FFF8DC",
                        "component": "#FFA500",
                        "dark": "#FF8C00",
                        "backgrounddark": "#FFFFE0",
                        "background": "#FFFACD"
                    },
                surprise: {
                        "DEFAULT": "#00BFFF",
                        "text": "#FFD700",
                        "component": "#FF6347",
                        "dark": "#003BD2",
                        "backgrounddark": "#FFDAB9",
                        "background": "#FFE4B5"
                    },
                    sadness: {
                        "DEFAULT": "#4682B4",
                        "text": "#F0F8FF",
                        "component": "#87CEEB",
                        "dark": "#4169E1",
                        "backgrounddark": "#B0E0E6",
                        "background": "#ADD8E6"
                    },
                    anger: {
                        "DEFAULT": "#A40014",
                        "text": "#FFB9B9",
                        "component": "#221113",
                        "dark": "#890817",
                        "backgrounddark": "#471C21",
                        "background": "#FFCCCC"
                    },
                    disgust: {
                        "DEFAULT": "#556B2F",
                        "text": "#F5FFFA",
                        "component": "#6B8E23",
                        "dark": "#4B5320",
                        "backgrounddark": "#8FBC8F",
                        "background": "#98FB98"
                    },
                    contempt: {
                        "DEFAULT": "#708090",
                        "text": "#F5F5F5",
                        "component": "#778899",
                        "dark": "#2F4F4F",
                        "backgrounddark": "#DCDCDC",
                        "background": "#D3D3D3"
                    },
                    shame: {
                        "DEFAULT": "#FFB6C1",
                        "text": "#FFF0F5",
                        "component": "#FF69B4",
                        "dark": "#DB7093",
                        "backgrounddark": "#FFDAB9",
                        "background": "#FFC0CB"
                    },
                    fear: {
                        "DEFAULT": "#9A44CE",
                        "text": "#1dff3c",
                        "component": "#C639A2",
                        "dark": "#ff00d8",
                        "backgrounddark": "#462E5E",
                        "background": "#E6E6FA"
                    },
                    guilt: {
                        "DEFAULT": "#5C2D91",
                        "text": "#FFE4E1",
                        "component": "#B22222",
                        "dark": "#3B0A67",
                        "backgrounddark": "#FA8072",
                        "background": "#FF6347"
                    },
                    excitement: {
                        DEFAULT: '#FF5308',
                        "text": '#FFD700',
                        "component": '#252525',
                        "dark": '#D44000',
                        "backgrounddark": '#5F3625',
                        "background": '#FFEBCC',
                    },
                    love: {
                        "DEFAULT": "#FF1493",
                        "text": "#FFE4E1",
                        "component": "#FF69B4",
                        "dark": "#C71585",
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