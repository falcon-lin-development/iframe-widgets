import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Snackbar,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

export const SponsoredChip: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '2px',
        borderRadius: '100px',
        overflow: 'hidden', // Clips the pseudo-element
        zIndex: 1, // Ensures the content appears above the gradient border
        background: 'linear-gradient(135deg, #D095EC 0%, #FFE57B 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: '0px 8px',
          borderRadius: '100px',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="labelMedium" sx={{ zIndex: 2 }}>
          Sponsored
        </Typography>
      </Box>
    </Box>
  );
};

export default SponsoredChip;
