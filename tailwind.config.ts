import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        cream: "var(--color-cream)",
        lime: "var(--color-lime)",
        "lime-dark": "var(--color-lime-dark)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        /* Header / Figma design tokens */
        "header-bg": "var(--color-header-bg)",
        "header-border": "var(--color-header-border)",
        "nav-link": "var(--color-nav-link)",
        "cta-text": "var(--color-cta-text)",
        "cta-icon-bg": "var(--color-cta-icon-bg)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      fontSize: {
        "nav-link": ["20.121px", { lineHeight: "28.744px", letterSpacing: "-0.5749px" }],
        "cta-button": ["16px", { lineHeight: "1.5" }],
      },
      fontWeight: {
        medium: "500",
        bold: "700",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "header": "31px",
        full: "9999px",
      },
      boxShadow: {
        header: "var(--shadow-header)",
      },
      backdropBlur: {
        header: "6.159px",
        button: "5px",
      },
      spacing: {
        "nav-gap": "58px",
        "header-x": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
