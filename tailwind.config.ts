import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            // Mengatur jarak antar paragraf agar tidak menempel
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              lineHeight: '1.6',
            },
            // Mengatur jarak antar item di dalam list
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            // Mengatur jarak antar list (ul/ol)
            ul: {
              marginTop: '1em',
              marginBottom: '1em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;