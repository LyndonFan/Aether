/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./public/index.html",
	],
	darkMode: false,
	theme: {
		extend: {
			maxWidth: {
				"1/8": "12.5%",
				"1/6": "16.666667%",
				"1/5": "20%",
				"1/4": "25%",
				"1/3": "33.333333%",
				"2/5": "40%",
				"1/2": "50%",
				"3/5": "60%",
				"2/3": "66.666667%",
				"3/4": "75%",
				"4/5": "80%",
				"5/6": "83.333333%",
				"7/8": "87.5%",
			},
			maxHeight: {
				"1/8": "12.5%",
				"1/6": "16.666667%",
				"1/5": "20%",
				"1/4": "25%",
				"1/3": "33.333333%",
				"2/5": "40%",
				"1/2": "50%",
				"3/5": "60%",
				"2/3": "66.666667%",
				"3/4": "75%",
				"4/5": "80%",
				"5/6": "83.333333%",
				"7/8": "87.5%",
			},
			minWidth: {
				"1/8": "12.5%",
				"1/6": "16.666667%",
				"1/5": "20%",
				"1/4": "25%",
				"1/3": "33.333333%",
				"2/5": "40%",
				"1/2": "50%",
				"3/5": "60%",
				"2/3": "66.666667%",
				"3/4": "75%",
				"4/5": "80%",
				"5/6": "83.333333%",
				"7/8": "87.5%",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
