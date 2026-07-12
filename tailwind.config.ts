import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Column-derived light institutional palette: indigo navy for
        // structure and primary actions, seafoam for data/code, one warm
        // orange reserved for rare high-signal accents.
        navy: "#111A4A",
        midnight: "#011821",
        slate: "#3B3E47",
        steel: "#666B75",
        fog: "#737783",
        mist: "#CBCCCF",
        line: "#E3E4E8",
        canvas: "#F6F6F8",
        charcoal: "#232730",
        obsidian: "#12161E",
        signal: "#EC652B",
        peach: "#F2936B",
        seafoam: {
          400: "#94EFB7",
          600: "#44B48B",
          700: "#167E6C"
        },
        deepsea: "#023247",
        cyan: "#88DEEB",
        cobalt: "#1E4199",
        ocean: "#0C6997"
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      maxWidth: {
        shell: "88rem"
      },
      boxShadow: {
        card: "rgba(18,22,30,0.024) 0px 1px 4px 0px, rgba(18,22,30,0.05) 0px 1px 0px 0px, rgba(18,22,30,0.024) 0px 0px 0px 1px",
        elevated:
          "rgba(0,0,0,0.02) 0px 40px 32px 0px, rgba(0,0,0,0.03) 0px 22px 18px 0px, rgba(0,0,0,0.03) 0px 12px 10px 0px, rgba(0,0,0,0.04) 0px 7px 5px 0px, rgba(0,0,0,0.07) 0px 3px 2px 0px",
        button:
          "rgba(17,26,74,0.1) 0px 1px 3px 0px, rgba(17,26,74,0.05) 0px 1px 0px 0px, rgba(255,255,255,0.5) 0px 1px 0px 0px inset, rgba(255,255,255,0.5) 0px 1px 4px 0px inset",
        widget: "rgba(30,30,44,0.15) 24px 48px 64px 0px, rgb(255,255,255) 0px 0px 0px 1px inset"
      },
      transitionTimingFunction: {
        pop: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }
    }
  },
  plugins: []
};

export default config;
