/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	fontFamily: {
  		sans: [
  			'ui-sans-serif',
  			'system-ui'
  		],
  		serif: [
  			'ui-serif',
  			'Georgia'
  		],
  		mono: [
  			'ui-monospace',
  			'SFMono-Regular'
  		],
  		logo: [
  			'Inter'
  		],
		universal: [
			'Poppins'
		]
  	},
  	extend: {
		screens: {
			'custom': '1055px', 
			'custom2': '490px'
		},
  		height: {
  			'90vh': '90vh',
  			'80vh': '80vh'
  		},
  		width: {
  			'90vw': '90vw'
  		},
  		colors: {
  			light1: '#f0f8ff',
  			light2: '#e6f7ff',
  			dark1: '#2c3e50',
  			dark2: '#34495e',
  			inputColour: '#f5f5f5',
  			credbg: '#e0e0e0',
  			header: '#b0dce2'
  		},
  		boxShadow: {
  			'3xl': '1px 15px 25px 5px rgba(0, 0, 0, 0.3)',
  			'4xl': '0px 3px 15px 1px rgba(0, 0, 0, 0.2)'
  		},
  		animation: {
  			typing: 'typing 1.5s steps(10, end) forwards, blink 0.7s infinite'
  		},
  		keyframes: {
  			typing: {
  				'0%': {
  					width: '0'
  				},
  				'100%': {
  					width: '100%'
  				}
  			},
  			blink: {
  				'0%, 100%': {
  					borderColor: 'transparent'
  				},
  				'50%': {
  					borderColor: 'white'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
}

