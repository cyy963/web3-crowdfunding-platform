import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-kanit)", "sans-serif"],
      },
      colors: {
        green: {
          100: "rgb(29, 192, 113)",
        },
        black: {
          100: "#13131a",
          200: "#1c1c24",
          300: "#3a3a43",
          400: "#808191",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "progress-bar":
          "linear-gradient(to right, rgb(29, 192, 113) 0%, rgb(0, 128, 68) 100%)",
        "progress-bar-bg":
          "linear-gradient(90deg, rgba(201,201,201,1) 0%, rgba(175,175,175,1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
