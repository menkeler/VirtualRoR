/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"],
    daisyui: {
        themes: [
          {
            mytheme: {
            
    "primary": "#008000",
              
    "secondary": "#1E90FF",
              
    "accent": "#4ade80",
              
    "neutral": "#2F4F4F",
              
    "base-100": "#f5f5f4",
              
    "info": "#87CEEB",
              
    "success": "#9ACD32",
              
    "warning": "#FFD700",
              
    "error": "#CD5C5C",
  
              },
            },
            
          ],
      },
  plugins: [require("daisyui")], 
}

