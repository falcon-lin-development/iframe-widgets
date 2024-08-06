import colors from '@/styles/colors.config';
import {
  Box,
  SxProps,
  Theme,
  Typography,
  TypographyOwnProps,
} from '@mui/material';

const MaxLineTypography: React.FC<{
  children: React.ReactNode;
  variant?: TypographyOwnProps['variant'];
  sx?: SxProps<Theme>;
}> = ({ children, sx, variant }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        color: colors.neutralSwatch.main[10],
        justifyContent: 'center',
        flexDirection: 'column',
        // maxHeight: '60px',
        // minHeight: '40px',
        ...sx,
      }}
    >
      <Typography
        variant={variant}
        sx={{
          display: '-webkit-box',
          whiteSpace: 'initial',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default MaxLineTypography;
