/** @type {import('tailwindcss').Config} */
import {nextui} from "@nextui-org/react";
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        primeColor: "#262626",
        /* purple primaryColor:"#6C47FF", */
       /*  hoverPrimaryColor:"#3F289D", */

       /* green hoverPrimaryColor:"#90BA0F",
        primaryColor:"#A0CF0D", */
        /* primaryColor:"#FF4500", */ 
        primaryColor:"#28B463", 
        hoverPrimaryColor:"#90BA0F",
        secondColor:"#F7F3FF",
        lightText: "#6D6D6D",
        grayBg:"#F4F4F5",
        secondGrayBg:"#3B3E39",
      },

      gridTemplateColumns: {
      

        'cards':  'repeat(auto-fit, minmax(300px, 1fr))',

      }, 
    },
  },
  plugins: [nextui()],
};
