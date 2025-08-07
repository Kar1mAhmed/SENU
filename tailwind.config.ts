import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {

            colors: {
                black: '#070707',
                blue: {
                    DEFAULT: '#0055D1',
                    soft: '#6EA2E3',   // new
                    light: '#DCF0F4',
                },
                red: {
                    DEFAULT: '#C13C1B',
                    light: '#E6CCE2',
                },
                yellow: {
                    DEFAULT: '#FAC53A',
                    light: '#F1C5A4',
                },
                green: {
                    DEFAULT: '#4FAF78',
                    soft: '#91CCAA',   // new

                    light: '#D4E9DD',
                },
                grid: '#1A1A1A',
            },
            fontFamily: {
                'new-black': ['var(--font-new-black)', 'sans-serif'],
                alexandria: ['var(--font-alexandria)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-fill': 'radial-gradient(circle at top right, rgba(77, 77, 77, 0.5) 0%, rgba(77, 77, 77, 0.2) 100%)',
            },
        },
    },
    plugins: [],
};

export default config;