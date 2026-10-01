import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "var(--olive)",
        oliveDeep: "var(--olive-deep)",
        oliveDark: "var(--olive-dark)",
        cream: "var(--cream)",
        creamSoft: "var(--cream-soft)",
        offWhite: "var(--off-white)",
        taupe: "var(--taupe)",
        charcoal: "var(--charcoal)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
