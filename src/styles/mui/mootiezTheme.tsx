import { createTheme } from '@mui/material/styles';
import colors from '@/styles/colors.config';
import assets from '@/constants';
import muiTheme from './muiTheme';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    headlineReport: React.CSSProperties;
    titleReport: React.CSSProperties;
    subtitleReport: React.CSSProperties;
    labelReport: React.CSSProperties;
    bodyReport: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    titleReport?: React.CSSProperties;
    headlineReport?: React.CSSProperties;
    subtitleReport?: React.CSSProperties;
    labelReport?: React.CSSProperties;
    bodyReport?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headlineReport: true;
    titleReport: true;
    subtitleReport: true;
    labelReport: true;
    bodyReport: true;
  }
}

export const mootiezTheme = createTheme(muiTheme, {
  typography: {
    fontFamily: ['Neue Metana', 'Inter', 'sans-serif'].join(','),
    headlineReport: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: '700',
      fontFamily: 'Neue Metana, sans-serif',
    },
    titleReport: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: '700',
      fontFamily: 'Neue Metana, sans-serif',
    },
    subtitleReport: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '700',
      fontFamily: 'Neue Metana, sans-serif',
    },
    labelReport: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '700',
      fontFamily: 'Neue Metana, sans-serif',
    },
    bodyReport: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 'normal',
      letterSpacing: '-0.4px',
      fontFamily: 'Basier Circle, sans-serif',
    },
  },
});

export const themeColors = {
  purple: '#D095EC',
  blue: '#87E4F9',
  yellow: '#FFE57B',
  pink: '#EA59A5',

  // custom
  pinkSwatch: {
    '0': '#000000',
    '5': '#2A0018',
    '10': '#3D0025',
    '15': '#500031',
    '20': '#63003E',
    '25': '#77004B',
    '30': '#8B0059',
    '35': '#9C1466',
    '40': '#AC2472',
    '50': '#CC408C',
    '60': '#EC5BA7',
    '70': '#FF81BE',
    '80': '#FFAFD1',
    '90': '#FFD8E6',
    '95': '#FFECF1',
    '98': '#FFF8F8',
    '99': '#FFFBFF',
    '100': '#FFFFFF',
  },
};

export default mootiezTheme;
