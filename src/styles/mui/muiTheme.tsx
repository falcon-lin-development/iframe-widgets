import { createTheme } from '@mui/material/styles';
import colors from '@/styles/colors.config';
import assets from '@/constants';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bodySmall: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleLarge: React.CSSProperties;
    headlineSmall: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    displaySmall: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displayLarge: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    bodySmall?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displayLarge?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodySmall: true;
    bodyMedium: true;
    bodyLarge: true;
    labelSmall: true;
    labelMedium: true;
    labelLarge: true;
    titleSmall: true;
    titleMedium: true;
    titleLarge: true;
    headlineSmall: true;
    headlineMedium: true;
    headlineLarge: true;
    displaySmall: true;
    displayMedium: true;
    displayLarge: true;
  }
}

export const muiTheme = createTheme({
  typography: {
    fontFamily: ['Inter', 'Libre Franklin', 'sans-serif'].join(','),
    bodySmall: {
      fontSize: '0.75rem', // Assuming 'xs' maps to 0.75rem based on MUI's default theme
      lineHeight: '1rem',
      fontWeight: 'normal',
      letterSpacing: '0.0125rem', // 0.2px
      fontFamily: 'Inter, sans-serif',
    },
    bodyMedium: {
      fontSize: '0.875rem', // Assuming 'sm' maps to 0.875rem based on MUI's default theme
      fontWeight: 'normal',
      letterSpacing: '0.015625rem', // 0.25px
      lineHeight: '1.25rem',
      fontFamily: 'Basier Circle',
    },
    bodyLarge: {
      fontSize: '1rem', // Assuming 'base' maps to 1rem based on MUI's default theme
      fontWeight: 'normal',
      letterSpacing: '0.03125rem', // 0.5px
      lineHeight: '1.5rem',
      fontFamily: 'Neue Metana',
    },
    labelSmall: {
      fontSize: '10px', // Assuming 'xxs' maps to 0.625rem based on MUI's default theme
      fontWeight: '400',
      letterSpacing: '0.1px', // 0.2px
      lineHeight: '16px',
      fontFamily: 'Neue Metana',
    },
    labelMedium: {
      fontSize: '0.75rem', // Assuming 'xs' again for labels
      fontWeight: '500',
      letterSpacing: '0.00625rem', // 0.1px
      lineHeight: '1rem',
      fontFamily: 'Neue Metana',
    },
    labelLarge: {
      fontSize: '0.875rem', // Assuming 'sm' for larger labels
      fontWeight: '500',
      letterSpacing: '0.1px',
      lineHeight: '1.25rem',
      fontFamily: 'Neue Metana',
    },
    titleSmall: {
      fontSize: '14px', // Assuming 'xs' maps to 0.75rem based on MUI's default theme
      fontWeight: '500',
      letterSpacing: '0.1px',
      lineHeight: '20px',
      fontFamily: 'Neue Metana',

      // fontFamily: 'Libre Franklin, sans-serif',
    },
    titleMedium: {
      fontSize: '1rem', // 'base' for medium titles
      fontWeight: '400',
      letterSpacing: '0.00625rem', // 0.1px
      lineHeight: '1.5rem',
      fontFamily: 'Neue Metana',
    },
    titleLarge: {
      fontSize: '1.25rem', // Assuming 'xl' maps to roughly 1.25rem based on MUI's default theme
      fontWeight: 'normal',
      // letterSpacing: '0.015625rem', // 0.25px
      lineHeight: '1.75rem',
      fontFamily: 'Neue Metana',
      // fontFamily: 'Libre Franklin, sans-serif',
    },
    headlineSmall: {
      fontSize: '24px',
      fontWeight: 'normal',
      lineHeight: '32px',
      fontFamily: 'Libre Franklin, sans-serif',
    },

    headlineLarge: {
      fontSize: '32px',
      fontWeight: 'normal',
      lineHeight: '40px',
      fontFamily: 'Libre Franklin, sans-serif',
    },
    displaySmall: {
      fontSize: '36px',
      fontWeight: 'normal',
      lineHeight: '44px',
      fontFamily: 'Libre Franklin, sans-serif',
    },
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            input: {
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: '1.25rem',
              letterSpacing: '0.5px',
              color: colors.neutralSwatch.main[10],
            },
            '& .MuiInputAdornment-root': {
              color: colors.neutralSwatch.main[30], // Replace with your desired color
              '& svg': {
                color: 'inherit', // This makes the svg icon inherit the color from the parent
              },
            },
          },
          '& .MuiFilledInput-root': {
            backgroundColor: colors.primarySwatch.main[95],
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            '&.Mui-focused': {
              backgroundColor: colors.primarySwatch.main[95],
            },
            '&:after': {
              // Underline focus color
              borderBottomColor: colors.primarySwatch.main[40],
            },
            '&.Mui-disabled': {
              // backgroundColor: colors.neutralSwatch.main[98],
            },
            '&:hover': {
              backgroundColor: colors.primarySwatch.main[95],
            },
          },
          '& .MuiInputLabel-root': {
            // Default label color
            color: colors.neutralSwatch.main[30],
            '&.Mui-focused': {
              // Label color when the input is focused
              color: colors.primarySwatch.main[40],
            },
            '&.Mui-error': {
              // Label color when there is an error
              color: colors.accentError,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          // color: colors.primarySwatch.lilac[40],
          '&:hover': {
            color: colors.primarySwatch.main[40],
            backgroundColor: colors.primarySwatch.main[95],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '1.25rem',
          letterSpacing: '0.1px',
          padding: '10px 0px',
        },
        text: {
          color: colors.primarySwatch.main[40], // Sets text color for text button
          padding: '10px',
          boxShadow: 'none', // Removes the default box shadow
          '&:hover': {
            backgroundColor: 'transparent', // Ensures the text button doesn't fill on hover
            color: colors.primarySwatch.main[50], // Darkens the text on hover
          },
        },
        outlined: {
          borderColor: colors.neutralSwatch.main[50], // Sets border color for outlined button
          color: colors.primarySwatch.main[40], // Sets text color for outlined button
          boxShadow: 'none', // Removes the default box shadow
          '&:hover': {
            backgroundColor: 'transparent', // Ensures the outlined button doesn't fill on hover
            borderColor: colors.neutralSwatch.main[60], // Darkens the border on hover
            color: colors.primarySwatch.main[50], // Darkens the text on hover
          },
        },
        contained: {
          backgroundColor: colors.primarySwatch.main[40], // Sets the background color for the contained button
          color: 'white', // Sets the text color for the contained button
          boxShadow: 'none', // Removes the default box shadow
          '&:hover': {
            backgroundColor: colors.primarySwatch.main[50], // Darkens the background on hover
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: colors.primarySwatch.main[40],
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '0.1px solid',
          borderColor: colors.primarySwatch.main[95],
          backgroundColor: colors.primarySwatch.main[98],
          '&:hover': {
            // cursor: 'pointer',
            // borderColor: colors.primary,
            // borderWidth: '1px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          width: '100%',
          borderBottom: 1,
          borderColor: 'divider',
          justifyContent: 'center',
          '& .MuiTab-root': {
            flexGrow: 1,
            textTransform: 'capitalize',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: colors.primarySwatch.main[40],
            height: 4,
            borderRadius: '100px 100px 0px 0px',
          },
          '& .Mui-selected': {
            color: `${colors.primarySwatch.main[40]} !important`,
          },
          '& .MuiTabScrollButton-root': {
            color: colors.neutralSwatch.main[40],
            width: '30px',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: 'center', // @dev dont change Default text alignment
          // default overflow ellipsis
          // whiteSpace: 'nowrap',
          // width: '100%', // @dev default has no width
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  },
});

export default muiTheme;
