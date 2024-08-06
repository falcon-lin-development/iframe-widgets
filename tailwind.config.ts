import type { Config } from 'tailwindcss';
import colors from './src/styles/colors.config';

const config: Config = {
  mode: 'jit',
  prefix: 'tw-',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    darkMode: false, // or 'media' or 'class'
    extend: {
      colors: {
        primarySwatch: colors.primarySwatch.main,
        secondarySwatch: colors.primarySwatch.main,
        neutralSwatch: colors.neutralSwatch.main,

        primary: colors.primary,
        secondary: colors.secondary,
        white: colors.white,
        success: colors.accentSuccess,
        info: colors.accentInfo,
        warning: colors.accentWarning,
        error: colors.accentError,
        /**
         * custom
         */
        defautBackground: colors.primarySwatch.main[98],
        appbar: colors.primarySwatch.main[98],
        appbarTitle: colors.neutralSwatch.main[10],
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        mobileReference: '375px',
      },
      fontSize: {},
      maxWidth: {
        se_mobile: '375px',
        mobile: '430px',
      },
      padding: {
        1.25: '0.3125rem',
      },

      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        libre: ['Libre Franklin', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
