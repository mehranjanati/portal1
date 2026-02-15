/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0a0a',
                    secondary: '#111111',
                    tertiary: '#1a1a1a'
                },
                accent: {
                    primary: '#00ff9d',
                    secondary: '#00b3ff',
                },
                text: {
                    primary: '#eaeaea',
                    muted: '#888888',
                },
                status: {
                    danger: '#ff2e2e',
                    warning: '#ffb020',
                    success: '#00ff9d',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'card': '12px',
                'button': '10px',
            },
            boxShadow: {
                'card': '0 8px 24px rgba(0,0,0,0.35)',
                'hover': '0 12px 32px rgba(0,0,0,0.5)',
            }
        },
    },
    plugins: [],
}
