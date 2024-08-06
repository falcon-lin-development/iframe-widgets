import { Box, SxProps, Theme } from '@mui/material';

const HighLightedWidget: React.FC<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #D095EC 0%, #FFE57B 100%)',
        borderRadius: '9999px',
        padding: '4px',
        // position
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default HighLightedWidget;
