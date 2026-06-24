import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        "ink-2": "#6e6e73",
        "ink-3": "#86868b",
        green: { DEFAULT: "#00694A", bright: "#00B478", link: "#0a7d5a" },
        stage: {
          white: "#C9CDD6", yellow: "#FBBF24", orange: "#FB923C", red: "#EF4444",
          green: "#00B478", purple: "#A88BFF", blue: "#5AA9FF", black: "#1d1d1f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
