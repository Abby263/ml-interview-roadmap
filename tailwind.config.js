/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        line: "var(--line)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        muted: "var(--muted)",
        ink: "var(--ink)",
      },
      fontFamily: {
        sans: ['"Manrope"', '"Avenir Next"', "sans-serif"],
        display: ['"Manrope"', '"Avenir Next"', "sans-serif"],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', '"Menlo"', '"Monaco"', "monospace"],
      },
      boxShadow: {
        roadmap: "0 24px 60px rgba(10, 25, 49, 0.10)",
        panel: "0 10px 30px rgba(7, 20, 39, 0.08)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 15% 20%, rgba(18, 179, 168, 0.20), transparent 32%), radial-gradient(circle at 80% 0%, rgba(15, 108, 189, 0.18), transparent 26%), radial-gradient(circle at 90% 80%, rgba(255, 159, 28, 0.12), transparent 28%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        rise: "rise 500ms ease-out both",
      },
    },
  },
  plugins: [],
};
