import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca Calixo — alineado con iOS/Android (Color.kt / CalixoColors.swift)
        primary: {
          DEFAULT: '#3B3C3D',
          light: '#6E6F70',
          dark: '#1E1F20',
          foreground: '#FFF753',
        },
        brand: {
          yellow: '#FFF753',
          gold: '#C9A227',
          'gold-light': '#FFD84D',
          'gold-dark': '#8A6E14',
          ink: '#232425',
        },
        neutral: {
          DEFAULT: '#6E6F70',
          light: '#9C9D9E',
          lighter: '#D2D2D1',
          dark: '#3B3C3D',
          darker: '#1E1F20',
        },
        complementary: {
          emerald: {
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
        },
        accent: {
          green: {
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
          red: {
            DEFAULT: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
          },
          yellow: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
          },
        },
        background: {
          DEFAULT: '#FAFAFA',
          surface: '#FFFFFF',
        },
        text: {
          DEFAULT: '#3B3C3D',
          light: '#6E6F70',
          dark: '#1E1F20',
        },
      },
      fontFamily: {
        sans: ['Questrial', 'system-ui', 'sans-serif'],
        serif: ['Trebuchet MS', 'Trebuchet', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        card: '1.25rem',
        control: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
