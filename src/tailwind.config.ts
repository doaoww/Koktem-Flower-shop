import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        nunito: ["var(--font-nunito)"],
      },
    },
    animation: {
  fadeIn: "fadeIn 0.4s ease forwards",
},
keyframes: {
  fadeIn: {
    "0%": { opacity: "0", transform: "translateY(16px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
},
theme: {
  extend: {
    fontFamily: {
      playfair: ["var(--font-playfair)"],
      nunito: ["var(--font-nunito)"],
    },
    animation: {
      fadeIn: "fadeIn 0.4s ease forwards",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(16px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
  },
},
  },
  plugins: [],
};

export default config;