/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#FFD93D",
                "primary-dark": "#B45309",
                "background-light": "#FFFBEB",
                "background-dark": "#272310",
                "text-main": "#451a03",
                "text-sub": "#92400e",
                "border-light": "#FDE68A",
            },
            fontFamily: {
                "display": ["Spline Sans", "Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "lg": "2rem",
                "xl": "3rem",
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(69, 26, 3, 0.05)',
                'glow': '0 0 15px rgba(255, 217, 61, 0.5)',
            }
        },
    },
    plugins: [],
}
