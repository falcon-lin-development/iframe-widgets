'use client';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import colors from '@/styles/colors.config';
import muiTheme from '@/styles/mui/muiTheme';

const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

export default MUIThemeProvider;
