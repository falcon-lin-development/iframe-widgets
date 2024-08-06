import { Box, CircularProgress } from '@mui/material';

export default function LoadingPage() {
  // You can add any UI inside Loading, including a Skeleton.s
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
