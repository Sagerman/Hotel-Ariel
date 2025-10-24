module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(210, 15%, 90%)",
        input: "hsl(210, 15%, 90%)",
        ring: "hsl(172, 37%, 46%)",
        background: "hsl(0, 0%, 98%)",
        foreground: "hsl(210, 15%, 15%)",
        primary: {
          DEFAULT: "hsl(40, 50%, 55%)",
          foreground: "hsl(30, 20%, 15%)",
        },
        secondary: {
          DEFAULT: "hsl(30, 30%, 40%)",
          foreground: "hsl(40, 30%, 90%)",
        },
        tertiary: {
          DEFAULT: "hsl(210, 30%, 96%)",
          foreground: "hsl(210, 15%, 18%)",
        },
        neutral: {
          DEFAULT: "hsl(0, 0%, 98%)",
          foreground: "hsl(210, 15%, 15%)",
        },
        success: {
          DEFAULT: "hsl(169, 63%, 41%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(12, 80%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(12, 80%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(210, 15%, 96%)",
          foreground: "hsl(210, 8%, 50%)",
        },
        accent: {
          DEFAULT: "hsl(172, 37%, 46%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 15%, 15%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 15%, 15%)",
        },
        gray: {
          50: "hsl(0, 0%, 98%)",
          100: "hsl(210, 15%, 96%)",
          200: "hsl(210, 15%, 90%)",
          300: "hsl(210, 10%, 80%)",
          400: "hsl(210, 9%, 70%)",
          500: "hsl(210, 8%, 60%)",
          600: "hsl(210, 8%, 50%)",
          700: "hsl(210, 8%, 40%)",
          800: "hsl(210, 8%, 25%)",
          900: "hsl(210, 15%, 10%)",
        },
        available: {
          DEFAULT: "hsl(40, 45%, 75%)",
          foreground: "hsl(30, 20%, 25%)",
        },
        occupied: {
          DEFAULT: "hsl(0, 0%, 20%)",
          foreground: "hsl(40, 30%, 85%)",
        },
        navbar: {
          DEFAULT: "hsl(30, 25%, 30%)",
          foreground: "hsl(40, 30%, 85%)",
        },
        hero: {
          foreground: "hsl(210, 15%, 10%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
        headline: ["Poppins", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.2" }],
        "2xl": ["1.5rem", { lineHeight: "1.2" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem',
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, hsl(30, 25%, 30%), hsl(25, 20%, 20%))',
        'gradient-2': 'linear-gradient(135deg, hsl(40, 50%, 55%), hsl(35, 45%, 45%))',
        'button-border-gradient': 'linear-gradient(90deg, hsla(40, 60%, 50%, 0.8), hsla(35, 55%, 60%, 0.6))',
      },
      letterSpacing: {
        headline: '-0.025em',
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
      },
      transitionTimingFunction: {
        'ease-in': 'ease-in',
      },
    },
  },
  plugins: [],
}
