/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				oscillateGradient: 'oscillateGradient 1s infinite linear',
			},
			keyframes: {
				oscillateGradient: {
					'0%': { background: '#3B82F6', transform: 'scale(1)' },
					'50%': { background: '#1D4ED8', transform: 'scale(1.05)' },
					'100%': { background: '#3B82F6', transform: 'scale(1)' },
				},
			}
		},

	},
	plugins: [],
}
