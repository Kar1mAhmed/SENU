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
                    40: "#60A5FA",
                    soft: '#6EA2E3',   // new
                    light: '#DCF0F4',
                },
                orange: {
                    DEFAULT: '#C13C1B',
                    50: '#FF7124',
                    30: '#FDBA74',
                    20: '#f5d0a8',
                    light: "#FF7124",
                    soft: '#DD846E',
                },
                red: {
                    DEFAULT: '#EF4444',
                    50: "#EF4444",
                    20: "#FECACA",
                    soft: '#DD846E',
                    light: '#E6CCE2',
                },
                yellow: {
                    DEFAULT: '#FAC53A',
                    light: '#FEF08A',
                },
                green: {
                    DEFAULT: '#4FAF78',
                    40: '#6EE7B7',
                    soft: '#91CCAA',   // new
                    light: '#D4E9DD',
                },
                purple: {
                    DEFAULT: '#8B5A9F',
                    light: '#C8A8D8',
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
                'glass-fill': 'radial-gradient(circle at top left, rgba(77, 77, 77, 0.5) 0%, rgba(77, 77, 77, 0.2) 100%)',
                'glass-fill-clients': 'radial-gradient(ellipse  at top left, rgba(77, 77, 77, 0.5) -10%, rgba(77, 77, 77, 0.2) 100%)',
                'button-border': 'linear-gradient(to right, rgba(77, 77, 77, 0.1) 0%, rgba(77, 77, 77, 0.5) 35%, rgba(77, 77, 77, 0.1) 68%, rgba(77, 77, 77, 0.5) 100%)',
                'stroke-gradient': 'linear-gradient(to right, rgba(77, 77, 77, 0.1) 0%, rgba(77, 77, 77, 0.5) 35%, rgba(77, 77, 77, 0.1) 68%, rgba(77, 77, 77, 0.5) 100%)',
            },
            animation: {
                'scroll': 'scroll 40s linear infinite',
                'scroll-mobile': 'scroll 40s linear infinite',
                'scroll-desktop': 'scroll 30s linear infinite',
            },
            keyframes: {
                'scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' },
                }
            },

        },
    },
    plugins: [],
};

export default config;