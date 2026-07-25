import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#09090B",
        surface: "#15151E",
        border: "rgba(255,255,255,0.08)",
        purple: {
          DEFAULT: "#8B5CF6",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        violet: {
          DEFAULT: "#A855F7",
          500: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 45px -5px rgba(139, 92, 246, 0.45)",
        "glow-sm": "0 0 20px -4px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 90px -10px rgba(168, 85, 247, 0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "gradient-purple": "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -4px rgba(139,92,246,0.35)" },
          "50%": { boxShadow: "0 0 50px 4px rgba(139,92,246,0.55)" },
        },
        ripple: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "skeleton-shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        ripple: "ripple 1.2s ease-out infinite",
        wave: "wave 1s ease-in-out infinite",
        shimmer: "skeleton-shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
