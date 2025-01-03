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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "progress-bar":
          "linear-gradient(to right, rgba(142,255,132,1) 0%, rgba(28,215,44,1) 50%, rgba(8,133,47,1) 100%)",
        "progress-bar-bg":
          "linear-gradient(90deg, rgba(201,201,201,1) 0%, rgba(175,175,175,1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
